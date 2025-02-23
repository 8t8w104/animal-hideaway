import { NextRequest, NextResponse } from "next/server";
import { ApplicationStatus, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function POST(req: NextRequest) {
  console.log("api/animals/id/decided/route.ts")
  // const id = req.nextUrl.pathname.split('/').pop();

  const paths = req.nextUrl.pathname.split("/");
  const idIndex = paths.indexOf("animals") + 1; // `animals` の次が `id`
  const id = paths[idIndex];

  console.log(id)
  console.log("↑id")
  let body;
  try {
    body = await req.json();
    console.log(body)
    console.log("↑body")
  } catch (error) {
    console.error("JSON parsing error:", error);
    return NextResponse.json({ error: "リクエストボディの解析に失敗しました。" }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ error: "IDが指定されていません。" }, { status: 400 });
  }


  console.log("before update")
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
    console.log("↓error")
    console.log(JSON.stringify(error)); // this will not cause any issue
    return NextResponse.json({ error: "ステータス更新に失敗しました。" }, { status: 500 });
  }
}
