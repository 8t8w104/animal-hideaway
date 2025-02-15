import { NextRequest, NextResponse } from "next/server";
import { ApplicationStatus, Gender, PrismaClient, PublicStatus } from "@prisma/client";
import { SUPABASE_BUCKETS } from "@/app/constants/env";
import { SIGNED_URL_EXPIRATION, SignedUrlType } from "@/utils/constants";
import { createClient } from "@/utils/supabase/server";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const params = Object.fromEntries(searchParams.entries());
  const { name, gender, applicationStatus, publicStatus } = params;

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
        }
      },
      where: {
        name: name ? { contains: name.toString() } : undefined,
        gender: gender as Gender,
        applicationStatus: applicationStatus as ApplicationStatus,
        publicStatus: publicStatus as PublicStatus,
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

    console.log(animals);
    console.log(`↑api/animals/api 取得結果`);

    return NextResponse.json(animals || []);
  } catch (error) {
    console.log(JSON.stringify(error))
    return NextResponse.json({ error: "取得に失敗しました。" }, { status: 500 });
  }
}

/**
 * filePathから署名付きURLを取得
 * @param filePath 画像のパス
 * @returns 署名付きURL (取得できなかった場合は `null`)
 */
async function getSupabaseSignedUrl(filePath: string): Promise<string | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(SUPABASE_BUCKETS)
    .createSignedUrl(filePath, SIGNED_URL_EXPIRATION);

  if (error) {
    console.error("Failed to get signed URL:", error.message);
    return null;
  }

  return data.signedUrl;
}
