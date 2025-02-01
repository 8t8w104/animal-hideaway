import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Animal } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const body: Animal = await req.json();

  // id  Int @id @default(autoincrement())
  // animalTypeId Int
  // name String
  // gender Gender?
  // age Int?
  // description String?
  // applicationStatus ApplicationStatus
  // publicStatus PublicStatus
  const animal = await prisma.animal.create({
    data: {
      animalTypeId: 1,
      name: "テスト動物",
      applicationStatus: "募集中",
      publicStatus: "下書き"
    },
  })
  console.log(animal)
  console.log("inserted animal")

  // TODO ファイルがあればImageテーブルにinsert
  // TODO 団体テーブルは必須なので、insert
  // TODO 関連テーブルが必須なので、insert


  return NextResponse.json(animal);
}
