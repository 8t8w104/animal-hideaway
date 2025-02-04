import { SUPABASE_BUCKETS } from "@/app/constants/env";
import { SIGNED_URL_EXPIRATION, SignedUrlType } from "@/utils/constants";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { filePath, action } = body;

  if (req.method !== "POST") {
    return NextResponse.json({ message: `Method not allowed.method=${req.method}` }, { status: 405 });

  }

  if (!filePath || !action) {
    return NextResponse.json({ message: 'filePathが指定されていません' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } =
    action === SignedUrlType.Upload
      ? await supabase.storage.from(SUPABASE_BUCKETS).createSignedUploadUrl(filePath, { upsert: true })
      : await supabase.storage.from(SUPABASE_BUCKETS).createSignedUrl(filePath, SIGNED_URL_EXPIRATION);


  console.log(data);
  console.log("↑data");
  console.log(error);
  console.log("↑error");

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ signedUrl: data.signedUrl });
}

/**
 * filePathから署名付きURLを取得
 * @param filePath 画像のパス
 * @returns 署名付きURL (取得できなかった場合は `null`)
 */
export async function getSupabaseSignedUrl(filePath: string): Promise<string | null> {
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
