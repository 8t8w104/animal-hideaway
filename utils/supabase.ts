import { createClient } from "@/utils/supabase/server";
import { SUPABASE_BUCKETS } from "@/utils/env";
import { SIGNED_URL_EXPIRATION } from "@/utils/constants";

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
