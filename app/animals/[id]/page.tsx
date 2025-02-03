import { AnimalDetail } from './components/AnimalDetail';
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/constants';

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  try {
    const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/animals/${id}`, {
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
