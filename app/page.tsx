import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function Home() {
  const animals = await prisma.animal.count()
  console.log(animals);

  return (
    <div>Home</div>
  );
}
