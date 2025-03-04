import { NextRequest, NextResponse } from "next/server";
import { ApplicationStatus, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function POST(req: NextRequest) {
  const paths = req.nextUrl.pathname.split("/");
  const idIndex = paths.indexOf("animals") + 1; // `animals` の次が `id`
  const id = paths[idIndex];
  const body = await req.json();
  const userId = body.userId;

  if (!id) {
    return NextResponse.json({ error: "IDが指定されていません。" }, { status: 400 });
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
    // 審査中であれば決定とし、決定であれば審査中に戻す
    const applicationStatus = body.decided ? ApplicationStatus.審査中 : ApplicationStatus.決定
    const updateAnimal = await prisma.animal.update({
      where: {
        id: Number(id),
      },
      data: {
        applicationStatus,
      },
    });

    return NextResponse.json({
      message: "ステータス更新しました。",
      isAnimalProcessed: updateAnimal ? true : false,
    });
  } catch (error) {
    console.log(JSON.stringify(error)); // this will not cause any issue
    return NextResponse.json({ error: "ステータス更新に失敗しました。" }, { status: 500 });
  }
}
