import { NextRequest, NextResponse } from "next/server";
import { ApplicationStatus, Gender, PrismaClient, PublicStatus } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});


type UploadFile = {
  fileName: string,
  generatedFilePath: string
}

type RequestBody = {
  animalTypeId: string,
  name: string,
  gender: Gender,
  applicationStatus: ApplicationStatus,
  publicStatus: PublicStatus,
  age: number,
  description: string,
  userId: string,
  uploadedFiles?: UploadFile[]
}

export async function PUT(req: NextRequest) {
  const body: RequestBody = await req.json();

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
      let insertedImages
      if (Array.isArray(body.uploadedFiles) && body.uploadedFiles.length > 0) {
        // createMany で一括挿入
        const imagesData = body.uploadedFiles.map((uploadedFile) => ({
          parentId: animal.id,
          path: uploadedFile.generatedFilePath || "",
          fileName: uploadedFile.fileName || "",
        }));

        insertedImages = await tx.image.createMany({
          data: imagesData,
        });
      }

      return {
        animal,
        organizationAnimal,
        insertedImages
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    const serverErrorMessage = JSON.stringify(error)
    console.log(`serverErrorMessage=${serverErrorMessage}`)
    return NextResponse.json({ error: `登録に失敗しました。${serverErrorMessage}` }, { status: 500 });
  }
}
