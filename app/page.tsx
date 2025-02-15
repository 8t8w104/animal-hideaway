import { NEXT_PUBLIC_API_BASE_URL } from "@/utils/constants";
import { Animals } from "./animals/components/Animals";

export default async function Home() {

  const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/animals`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const animals = await response.json();

  return (
    <>
      <Animals initAnimals={animals} />
    </>
  );
}
