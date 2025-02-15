import { NextRequest, NextResponse } from "next/server";
import { ApplicationStatus, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
    const updatedAnimal = await prisma.animal.update({
      where: {
        id: Number(id),
        // applicationStatus: ApplicationStatus.募集中
      },
      data: {
        applicationStatus: ApplicationStatus.審査中,
      },
    });
    // console.log("after update")

    console.log("before adoptionApplication.create")
    const date = new Date()

    const adoptionApplication = {
      animal: { connect: { id: Number(id) } },
      individual: { connect: { individualId: body.userId } },
      applicationDate: date,
      notes: "この動物をぜひ引き取りたいです！",
      createdAt: date,
      updatedAt: date,
      createdBy: body.userId,
      updatedBy: body.userId
    }


    // const newApplication = await prisma.adoptionApplication.create({ data: adoptionApplication })


    // console.log(`body.userId=${body.userId}`)
    // console.log(`date=${date}`)
    // const adoptionApplication = await prisma.adoptionApplication.create({
    //   data: {
    //     animalId: Number(id),
    //     individualId: String(body.userId),
    //     applicationDate: date,
    //     notes: 'memoです',
    //     createdAt: date,
    //     updatedAt: date,
    //     createdBy: body.userId,
    //     updatedBy: body.userId,
    //   }
    // })


    // console.log(newApplication)
    console.log("after adoptionApplication.create")

    // return NextResponse.json(newApplication);
    return NextResponse.json([]);
  } catch (error) {
    console.log("↓error")
    // console.log(error)
    console.log(JSON.stringify(error)); // this will not cause any issue
    // console.log(e);

    return NextResponse.json({ error: "更新に失敗しました。" }, { status: 500 });
  }
}
