import { NextRequest, NextResponse } from "next/server";
import { ApplicationStatus, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function POST(req: NextRequest) {
  console.log("api/animals/id/apply/route.ts")
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
    await prisma.animal.update({
      where: {
        id: Number(id),
      },
      data: {
        applicationStatus: ApplicationStatus.審査中,
      },
    });

    console.log("before IndividualAnimal.create")

    // 既に登録されているかを確認
    const countIndividualAnimal = await prisma.individualAnimal.count({
      where: {
        animalId: Number(id),
        individualId: body.userId,
      },
    });

    let createIndividualAnimal
    if (countIndividualAnimal === 0) {
      createIndividualAnimal = await prisma.individualAnimal.create({
        data: {
          individualId: body.userId,
          animalId: Number(id),
        }
      })
    }

    console.log("before adoptionApplication.create")

    // 既に登録されているかを確認
    const countAdoptionApplication = await prisma.adoptionApplication.count({
      where: {
        animalId: Number(id),
        individualId: body.userId,
      },
    });

    let createApplication
    if (countAdoptionApplication === 0) {
      const date = new Date()

      const adoptionApplication = {
        animalId: Number(id),
        individualId: body.userId,
        applicationDate: date,
        notes: "",
        createdAt: date,
        updatedAt: date,
        createdBy: body.userId,
        updatedBy: body.userId,
      }

      createApplication = await prisma.adoptionApplication.create({ data: adoptionApplication })
    }

    console.log("after adoptionApplication.create")

    console.log(createApplication)
    console.log("↑createApplication")

    return NextResponse.json({
      message: "応募完了しました。",
      isApplicationProcessed: createApplication ? true : false,
      isFavoriteProcessed: createIndividualAnimal ? true : false,
    });
  } catch (error) {
    console.log("↓error")
    console.log(JSON.stringify(error)); // this will not cause any issue
    return NextResponse.json({ error: "更新に失敗しました。" }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest) {
  console.log("api/animals/id/apply/route.ts DELETE");

  // URL から animal の id を取得
  const paths = req.nextUrl.pathname.split("/");
  const idIndex = paths.indexOf("animals") + 1; // `animals` の次が id
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
    // 1. AdoptionApplication を削除する

    // 既に登録されているかを確認
    const countAdoptionApplication = await prisma.adoptionApplication.count({
      where: {
        animalId: Number(id),
        individualId: body.userId,
      },
    });

    let deleteApplication
    if (countAdoptionApplication === 1) {

      deleteApplication = await prisma.adoptionApplication.delete({
        where: {
          animalId_individualId: {
            animalId: Number(id),
            individualId: body.userId,
          }
        },
      });
      console.log("deleteApplication:", deleteApplication);
    }


    // 2. IndividualAnimal を削除する

    // 既に登録されているかを確認
    const countIndividualAnimal = await prisma.individualAnimal.count({
      where: {
        animalId: Number(id),
        individualId: body.userId,
      },
    });

    let deleteIndividualAnimal
    if (countIndividualAnimal === 1) {
      deleteIndividualAnimal = await prisma.individualAnimal.delete({
        where: {
          animalId_individualId: {
            animalId: Number(id),
            individualId: body.userId,
          }
        },
      });

      console.log("deleteIndividualAnimal:", deleteIndividualAnimal);
    }

    // 3. 必要であれば、Animal の applicationStatus を「募集中」に戻す
    await prisma.animal.update({
      where: { id: Number(id) },
      data: { applicationStatus: ApplicationStatus.募集中 },
    });
    console.log("Animal status updated to 募集中");
    console.log(deleteApplication)
    console.log("↑deleteApplication")
    return NextResponse.json({
      message: "応募解除しました。",
      isApplicationProcessed: deleteApplication ? true : false,
      isFavoriteProcessed: deleteIndividualAnimal ? true : false,
    });
  } catch (error) {
    console.error("応募解除エラー:", JSON.stringify(error));
    return NextResponse.json({ error: "応募解除に失敗しました。" }, { status: 500 });
  }
}
