
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function Home() {
  const animals = await prisma.animal.count()
  console.log(animals);

  return (
    <div>Home</div>
  );
}
