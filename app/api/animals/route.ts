import { NextRequest, NextResponse } from "next/server";
import { Gender, PrismaClient } from "@prisma/client";
import { getSupabaseSignedUrl } from "../signed-url/route";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  // AuthorizationヘッダーからuserIdを取得
  // const authHeader = req.headers.get('Authorization');
  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }
  // const token = authHeader.split(' ')[1]; // "Bearer XXX" のXXX部分を取得


  const searchParams = req.nextUrl.searchParams;

  console.log(searchParams);
  console.log("↑searchParams");


  const where: any = {};

  const gender = searchParams.get('gender');
  if (gender) {
    where.gender = gender as Gender;
  }
  const name = searchParams.get('name');
  if (name) {
    where.name = { contains: name, mode: 'insensitive' };
  }

  const animals = await prisma.animal.findMany({
    select: {
      id: true,
      name: true,
      description: true,
      gender: true,
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
    // where: {
    //   gender: gender ? gender as Gender : undefined,
    //   name: name ? { contains: name, mode: 'insensitive' } : undefined,  // ここでnameの条件を直接指定
    // }
    where
  });

  console.log(animals);
  console.log(`↑api/animals/api 検索結果`);

  // 取得結果1件以上の場合
  if (animals.length) {
    await Promise.all(
      animals.map(async (animal) => {
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
      })
    );
  }

  return NextResponse.json(animals || []);
}
