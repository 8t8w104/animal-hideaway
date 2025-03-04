import { NextRequest, NextResponse } from "next/server";
import { ApplicationStatus, Gender, PrismaClient, PublicStatus } from "@prisma/client";
import { getSupabaseSignedUrl } from "@/utils/supabase";

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const params = Object.fromEntries(searchParams.entries());
  const { name, gender, applicationStatus, publicStatus, animalType } = params;
  try {
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
        },
        OrganizationAnimal: {
          select: {
            organizationId: true
          }
        }
      },
      where: {
        name: name ? { contains: name.toString() } : undefined,
        gender: gender as Gender,
        applicationStatus: applicationStatus as ApplicationStatus,
        publicStatus: publicStatus as PublicStatus,
        animalTypeId: animalType ? Number(animalType) : undefined
      }
    });

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
  } catch (error) {
    console.log(JSON.stringify(error))
    return NextResponse.json({ error: "取得に失敗しました。" }, { status: 500 });
  }
}
