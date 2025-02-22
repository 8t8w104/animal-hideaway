// app/api/animals/[id]/favorite/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function POST(req: NextRequest) {
  console.log("api/animals/id/favorite/route.ts POST");

  // URLから animal の id を取得
  const paths = req.nextUrl.pathname.split("/");
  const idIndex = paths.indexOf("animals") + 1;
  const id = paths[idIndex];

  if (!id) {
    return NextResponse.json({ error: "IDが指定されていません。" }, { status: 400 });
  }

  let body;
  try {
    body = await req.json();
    console.log("リクエストボディ:", body);
  } catch (error) {
    console.error("JSON parsing error:", error);
    return NextResponse.json({ error: "リクエストボディの解析に失敗しました。" }, { status: 400 });
  }

  try {

    // 既に登録されているかを確認
    const count = await prisma.individualAnimal.count({
      where: {
        animalId: Number(id),
        individualId: body.userId,
      },
    });

    if (count > 0) {
      console.log("既にお気に入り登録済み。処理を終了します。");
      return NextResponse.json({ message: "既にお気に入り登録済みです。" });
    }

    // individualAnimal にお気に入り情報を登録
    const favorite = await prisma.individualAnimal.create({
      data: {
        individualId: body.userId,
        animalId: Number(id),
      },
    });
    console.log("お気に入り登録:", favorite);
    // return NextResponse.json(favorite);
    return NextResponse.json({
      message: "お気に入り登録しました。",
      isFavoriteProcessed: favorite ? true : false,
    });
  } catch (error) {
    console.error("お気に入り登録エラー:", JSON.stringify(error));
    return NextResponse.json({ error: "お気に入り登録に失敗しました。" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  console.log("api/animals/id/favorite/route.ts DELETE");

  // URLから animal の id を取得
  const paths = req.nextUrl.pathname.split("/");
  const idIndex = paths.indexOf("animals") + 1;
  const id = paths[idIndex];

  if (!id) {
    return NextResponse.json({ error: "IDが指定されていません。" }, { status: 400 });
  }

  let body;
  try {
    body = await req.json();
    console.log("リクエストボディ:", body);
  } catch (error) {
    console.error("JSON parsing error:", error);
    return NextResponse.json({ error: "リクエストボディの解析に失敗しました。" }, { status: 400 });
  }

  try {

    // 既に登録されているかを確認
    const count = await prisma.individualAnimal.count({
      where: {
        animalId: Number(id),
        individualId: body.userId,
      },
    });

    if (count === 0) {
      console.log("お気に入り登録がありません。処理を終了します。");
      return NextResponse.json({ message: "お気に入り登録がありません。" });
    }

    // 複合ユニークキーを利用して、individualAnimal からお気に入り情報を削除
    const deletedFavorite = await prisma.individualAnimal.delete({
      where: {
        animalId_individualId: {
          animalId: Number(id),
          individualId: body.userId,
        },
      },
    });
    console.log("お気に入り解除:", deletedFavorite);

    return NextResponse.json({
      message: "お気に入り解除しました。",
      isFavoriteProcessed: deletedFavorite ? true : false,
    });
  } catch (error) {
    console.error("お気に入り解除エラー:", JSON.stringify(error));
    return NextResponse.json({ error: "お気に入り解除に失敗しました。" }, { status: 500 });
  }
}
