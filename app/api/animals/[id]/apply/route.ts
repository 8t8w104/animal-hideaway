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
    await prisma.individualAnimal.create({
      data: {
        individualId: body.userId,
        animalId: Number(id),
      }
    })

    console.log("before adoptionApplication.create")
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

    const newApplication = await prisma.adoptionApplication.create({ data: adoptionApplication })

    console.log(newApplication)
    console.log("after adoptionApplication.create")

    return NextResponse.json(newApplication);
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
    const deleteApplication = await prisma.adoptionApplication.delete({
      where: {
        animalId_individualId: {
          animalId: Number(id),
          individualId: body.userId,
        }
      },
    });
    console.log("deleteApplication:", deleteApplication);

    // 2. IndividualAnimal を削除する
    const deleteIndividualAnimal = await prisma.individualAnimal.delete({
      where: {
        animalId_individualId: {
          animalId: Number(id),
          individualId: body.userId,
        }
      },
    });

    console.log("deleteIndividualAnimal:", deleteIndividualAnimal);

    // 3. 必要であれば、Animal の applicationStatus を「募集中」に戻す
    await prisma.animal.update({
      where: { id: Number(id) },
      data: { applicationStatus: ApplicationStatus.募集中 },
    });
    console.log("Animal status updated to 募集中");

    return NextResponse.json({
      message: "応募解除しました。",
      deleteApplication,
      deleteIndividualAnimal,
    });
  } catch (error) {
    console.error("応募解除エラー:", JSON.stringify(error));
    return NextResponse.json({ error: "応募解除に失敗しました。" }, { status: 500 });
  }
}
