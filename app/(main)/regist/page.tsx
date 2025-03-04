import { createClient } from "@/utils/supabase/server";
import { Regist } from "./components/Regist";
import { redirect } from 'next/navigation'

export default async function Page() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <Regist userId={data?.user.id} />
  );
}
