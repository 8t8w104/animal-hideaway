
import { useParams } from 'next/navigation';
import { AnimalsDetail } from './components/AnimalsDetail';
import { AnimalWithRelations } from '@/types/Animal';
import { ApplicationStatus, Gender, PublicStatus } from '@prisma/client';
import { NEXT_PUBLIC_API_BASE_URL } from '@/utils/constants';


export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;
  console.log(`animals/[id]=${id}`)

  // 動物を取得
  const res = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/animals/${params.id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  if (!res.ok) {
    console.log("データ取得に失敗しました。")
    return;
  }

  const animals = await res.json();
  console.log(animals)
  console.log("↑detail/page.tsx animals")

  return (
    <AnimalsDetail animal={animals} />
  );
}
