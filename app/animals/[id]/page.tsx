import { AnimalDetail } from './components/AnimalDetail';
import { NEXT_PUBLIC_API_BASE_URL, Role } from '@/utils/constants';
import { createClient } from "@/utils/supabase/server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();
  const role = user?.user_metadata?.role;
  const userId = user?.id;

  try {
    const url = new URL(`${NEXT_PUBLIC_API_BASE_URL}/api/animals/${id}`);
    // 一般の場合、お気に入り/応募の数を取得
    if (userId && role === Role.General) {
      url.searchParams.append('userId', userId);
    }

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      console.error(`データ取得に失敗しました。ステータス: ${res.status}`);
      return <p>データの取得に失敗しました。</p>;
    }

    const animal = await res.json();
    return <AnimalDetail animal={animal} />;
  } catch (error) {
    console.error("エラーが発生しました:", error);
    return <p>データの取得に失敗しました。</p>;
  }
}
