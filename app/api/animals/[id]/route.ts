import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
}
// export async function GET(req: NextRequest) {
//   // ルートパラメータの`id`を取得
//   const pathname = req.nextUrl.pathname;
//   const id = pathname.split('/').pop();

//   if (!id) {
//     return NextResponse.json({ error: "IDが指定されていません。" }, { status: 400 });
//   }

//   // Prismaで検索
//   const animal = await prisma.animal.findUnique({
//     where: { id: Number(id) },
//     select: {
//       id: true,
//       name: true,
//       description: true,
//       gender: true,
//       applicationStatus: true,
//       publicStatus: true,
//       animalType: {
//         select: {
//           id: true,
//           type: true
//         }
//       }
//     },
//   });

//   // 結果を返却
//   if (!animal) {
//     return NextResponse.json({ error: "動物が見つかりません。" }, { status: 404 });
//   }

//   return NextResponse.json(animal);
// }
