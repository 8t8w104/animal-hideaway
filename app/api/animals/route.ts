import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  console.log("↑animals/route.ts");
  // AuthorizationヘッダーからuserIdを取得
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(' ')[1]; // "Bearer XXX" のXXX部分を取得

  // console.log("[todos/route.ts]before findMany");
  // const todos = await prisma.animal.findMany({
  //   where: {
  //     userId: token
  //   },
  //   orderBy: [
  //     {
  //       status: 'asc',
  //     },
  //     {
  //       updateAt: 'desc',
  //     },
  //   ]
  // });
  // console.log("[todos/route.ts]after findMany");
  // console.log(`todos = ${todos}`);
  // return NextResponse.json(todos || []);
  return NextResponse.json( []);
}
