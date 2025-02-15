import { NEXT_PUBLIC_API_BASE_URL } from "@/utils/constants";
import { Animals } from "./animals/components/Animals";
import { redirect } from 'next/navigation'

export default async function Home() {

  const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/animals`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    redirect(`/error?message=${response.status}:${response.statusText}`);
  }

  const animals = await response.json();

  return (
    <>
      <Animals initAnimals={animals} />
    </>
  );
}
