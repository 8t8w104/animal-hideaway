import { NextRequest, NextResponse } from "next/server";
import { ApplicationStatus, Gender, PrismaClient, PublicStatus, Image } from "@prisma/client";
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
          take: 1, // 一覧画面では画像１枚のみ取得
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
            organizationId: true,
            organization: {
              select: {
                name: true
              }
            }
          }
        }
      },
      where: {
        name: name ? { contains: name.toString() } : undefined,
        gender: gender ? { in: Array.isArray(gender) ? gender.map(g => g as Gender) : [gender as Gender] } : undefined,
        applicationStatus: applicationStatus ? { in: Array.isArray(applicationStatus) ? applicationStatus.map(s => s as ApplicationStatus) : [applicationStatus as ApplicationStatus] } : undefined,
        publicStatus: publicStatus ? { in: Array.isArray(publicStatus) ? publicStatus.map(s => s as PublicStatus) : [publicStatus as PublicStatus] } : undefined,
        animalTypeId: animalType ? { in: Array.isArray(animalType) ? animalType.map(Number) : [Number(animalType)] } : undefined
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
