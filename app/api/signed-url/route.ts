import { SUPABASE_BUCKETS } from "@/app/constants/env";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { filePath } = body;

  if (req.method !== "POST") {
    return NextResponse.json({ message: `Method not allowed.method=${req.method}` }, { status: 405 });

  }

  if (!filePath) {
    return NextResponse.json({ message: 'filePathが指定されていません' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data, error } = await supabase.storage.from(SUPABASE_BUCKETS).createSignedUploadUrl(filePath, { upsert: true })

  console.log(`data=${data}`);
  console.log(`error=${error}`);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ signedUrl: data.signedUrl });
}
