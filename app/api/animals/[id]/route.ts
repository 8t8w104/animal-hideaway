import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSupabaseSignedUrl } from "@/utils/supabase";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: "IDが指定されていません。" }, { status: 400 });
  }

  try {
    const animal = await prisma.animal.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        gender: true,
        description: true,
        applicationStatus: true,
        publicStatus: true,
        animalType: {
          select: {
            id: true,
            type: true
          }
        },
        Image: {
          select: {
            parentId: true,
            imageUrl: true,
            fileName: true,
            path: true,
            contentType: true,
            publicFlag: true,
          }
        }
      },
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

    console.log(animal)
    console.log("↑api/animals/[id] 検索結果")

    return NextResponse.json(animal);
  } catch (error) {
    return NextResponse.json({ error: "データ取得に失敗しました。" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split('/').pop();
  const body = await req.json();

  if (!id) {
    return NextResponse.json({ error: "IDが指定されていません。" }, { status: 400 });
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
  const id = req.nextUrl.pathname.split('/').pop();

  if (!id) {
    return NextResponse.json({ error: "IDが指定されていません。" }, { status: 400 });
  }

  try {
    await prisma.animal.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: "動物が削除されました。" });
  } catch (error) {
    console.log(JSON.stringify(error))
    console.log("↑JSON.stringify(error)")
    return NextResponse.json({ error: "削除に失敗しました。" }, { status: 500 });
  }
}
