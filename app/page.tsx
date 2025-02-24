import { NEXT_PUBLIC_API_BASE_URL } from "@/utils/constants";

import { redirect } from 'next/navigation'
// import { Animals } from "./(main)/animals/components/Animals";
import { Animals } from "@/app/(main)/animals/components/Animals";
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
