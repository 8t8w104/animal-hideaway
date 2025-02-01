import { NextRequest, NextResponse } from "next/server";
import { Gender, PrismaClient } from "@prisma/client";

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

  console.log(where)
  console.log("↑where")

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

  return NextResponse.json(animals || []);
}
