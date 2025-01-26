import { createClient } from "@/utils/supabase/server";
import { HeaderClient } from "./HeaderClient";
import { createSupabaseClient } from "@/utils/supabase/client";

export const Header = async () => {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();
  console.log(user)
  console.log("↑supabaseServer.auth.getUser()")

  const supabaseClient = await createSupabaseClient();
  const session = await supabaseClient.auth.getSession()
  console.log(session);
  console.log("↑supabaseClient.auth.getSession()");

  return (
    <header>
      <HeaderClient user={user} />
    </header>
  );
};
