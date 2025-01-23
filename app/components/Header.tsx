import { createClient } from "@/utils/supabase/server";
import { HeaderClient } from "./HeaderClient";

export const Header = async () => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header>
      <HeaderClient user={user} />
    </header>
  );
};
