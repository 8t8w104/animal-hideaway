import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function PUT(req: NextRequest) {
  const body = await req.json();

  try {
    // トランザクションを開始
    const result = await prisma.$transaction(async (tx) => {
      // Animalテーブル
      const animal = await tx.animal.create({
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
      const organizationAnimal = await tx.organizationAnimal.create({
        data: {
          animalId: animal.id,
          organizationId: body.userId,
        },
      })
      console.log(organizationAnimal)
      console.log("inserted organizationAnimal")

      // 画像（image）
      if (body.filePath) {
        const image = await tx.image.create({
          data: {
            parentId: animal.id,
            path: body.filePath || "",
            fileName: body.fileName || "",
          },
        })
        console.log(image)
        console.log("inserted image")
      }

      return {
        animal,
        organizationAnimal
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    const serverErrorMessage = JSON.stringify(error)
    console.log(`serverErrorMessage=${serverErrorMessage}`)
    return NextResponse.json({ error: `登録に失敗しました。${serverErrorMessage}` }, { status: 500 });
  }
}
