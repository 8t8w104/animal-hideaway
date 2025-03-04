import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSupabaseSignedUrl } from "@/utils/supabase";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  const userId = req.nextUrl.searchParams.get('userId');

  if (!id) {
    return NextResponse.json({ error: "IDが指定されていません。" }, { status: 400 });
  }

  const baseSelect = {
    id: true,
    name: true,
    gender: true,
    description: true,
    applicationStatus: true,
    publicStatus: true,
    animalType: {
      select: {
        id: true,
        type: true,
      },
    },
    Image: {
      select: {
        parentId: true,
        imageUrl: true,
        fileName: true,
        path: true,
        contentType: true,
        publicFlag: true,
      },
    },
    OrganizationAnimal: {
      select: {
        organizationId: true
      }
    }
  };

  // userIdが存在する場合のみ_countをselectに追加
  const selectObject = userId
    ? {
      ...baseSelect,
      _count: {
        select: {
          IndividualAnimal: {
            where: { individualId: userId },
          },
          AdoptionApplication: {
            where: { individualId: userId },
          },
        },
      },
    }
    : baseSelect;

  try {
    const animal = await prisma.animal.findUnique({
      where: { id: Number(id) },
      select: selectObject
    });

    if (!animal) {
      return NextResponse.json({ error: "動物が見つかりません。" }, { status: 404 });
    }

    // 画像が存在する場合
    if (animal.Image.length) {
      animal.Image = await Promise.all(
        animal.Image.map(async (image) => {
          return {
            ...image,
            // オブジェクトキーより署名付きURLを取得する
            imageUrl: await getSupabaseSignedUrl(image.path),
          }
        })
      );
    }

    return NextResponse.json(animal);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "データ取得に失敗しました。" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  const body = await req.json();
  const userId = body.userId;

  if (!id) {
    return NextResponse.json({ error: "IDが指定されていません。" }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json({ error: "userIdが指定されていません。" }, { status: 400 });
  }

  const organizationAnimal = await prisma.organizationAnimal.findFirst({
    where: { animalId: Number(id), organizationId: userId }
  });
  if (!organizationAnimal) {
    return NextResponse.json({ error: "この動物は団体に登録されていません。" }, { status: 400 });
  }

  try {
    const updatedAnimal = await prisma.animal.update({
      where: { id: Number(id) },
      data: {
        name: body.name,
        gender: body.gender,
        description: body.description,
        applicationStatus: body.applicationStatus,
        publicStatus: body.publicStatus,
      },
    });

    return NextResponse.json(updatedAnimal);
  } catch (error) {
    return NextResponse.json({ error: "更新に失敗しました。" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const body = await req.json();
  const userId = body.userId;

  if (!id) {
    return NextResponse.json(
      { error: "IDが指定されていません。" },
      { status: 400 }
    );
  }

  if (!userId) {
    return NextResponse.json(
      { error: "userIdが指定されていません。" },
      { status: 400 }
    );
  }

  // 指定の動物が指定の団体に登録されているか確認
  const organizationAnimal = await prisma.organizationAnimal.findFirst({
    where: { animalId: Number(id), organizationId: userId },
  });
  if (!organizationAnimal) {
    return NextResponse.json(
      { error: "この動物は団体に登録されていません。" },
      { status: 400 }
    );
  }

  try {
    // トランザクション内で関連レコードを削除
    await prisma.$transaction(async (tx) => {
      // 画像（image）の削除
      await tx.image.deleteMany({
        where: {
          parentId: Number(id),
        },
      });
      console.log("画像削除完了");

      // 団体に属する動物（organization_animal）の削除
      await tx.organizationAnimal.delete({
        where: {
          animalId_organizationId: {
            animalId: Number(id),
            organizationId: userId,
          }
        },
      });

      console.log("organizationAnimal削除完了");

      // 動物（animal）の削除
      await tx.animal.delete({
        where: { id: Number(id) },
      });
      console.log("animal削除完了");
    });

    return NextResponse.json({ message: "動物が削除されました。" });
  } catch (error) {
    console.log(JSON.stringify(error))
    return NextResponse.json({ error: "削除に失敗しました。" }, { status: 500 });
  }
}
