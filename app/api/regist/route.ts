import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Animal } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const body = await req.json();
  console.log(body)
  // Animalテーブル
  const animal = await prisma.animal.create({
    data: {
      animalTypeId: Number(body.animalTypeId),
      name: body.name,
      gender: body.gender,
      applicationStatus: body.applicationStatus,
      publicStatus: body.publicStatus,
      age: body.age,
      description: body.description,
    },
  })
  console.log(animal)
  console.log("inserted animal")

  // 団体に属する動物（organization_animal）
  const organizationAnimal = await prisma.organizationAnimal.create({
    data: {
      animalId: animal.id,
      organizationId: "org_001",
      userId: body.userId
    },
  })
  console.log(organizationAnimal)
  console.log("inserted organizationAnimal")

  // 画像（image）
  const image = await prisma.image.create({
    data: {
      parentId: animal.id,
      path: body.filePath || "",
      fileName: body.fileName || "",
    },
  })
  console.log(image)
  console.log("inserted image")

  return NextResponse.json(animal);
}
