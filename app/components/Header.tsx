import { createClient } from "@/utils/supabase/server";
import { HeaderClient } from "./HeaderClient";

export const Header = async () => {
  const supabaseServer = await createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();

  return (
    <header>
      <HeaderClient user={user} />
    </header>
  );
};
