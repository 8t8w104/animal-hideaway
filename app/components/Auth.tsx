'use client'
import { createSupabaseClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export const Auth = () => {
  const router = useRouter()

  const handleLogin = async (provider: 'google' | 'github') => {
    const supabase = await createSupabaseClient();
    const redirectTo = process.env.NEXT_PUBLIC_SUPABASE_GITHUB_REDIRECT_URL!
    console.log(`redirectTo=${redirectTo}`);
    const role = "general"
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${redirectTo}?role=${role}`
      },
    })
    if (error) console.error('Error logging in:', error.message);

    console.log("Auth 1")

    // // ログイン完了後、セッションが確立されるのを待つ
    // const {
    //   data: { session },
    // } = await supabase.auth.getSession();
    // console.log("Auth 2")
    // if (!session) {
    //   console.error("Session is not available after login.");
    //   return;
    // }
    // console.log("Auth 3")
    // // ユーザーの role を更新
    // const { error: updateError } = await supabase.auth.updateUser({
    //   data: { role: '職員' },
    // });
    // console.log("Auth 4")
    // if (updateError) {
    //   console.error('Error updating user role:', updateError.message);
    // } else {
    //   console.log('User role updated successfully.');
    // }
    // console.log("Auth 5")
  };

  const handleLogout = async () => {
    const supabase = await createSupabaseClient();
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
    router.push("/")
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={() => handleLogin('google')}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Googleでログインする
      </button>
      <button
        onClick={() => handleLogin('github')}
        className="px-4 py-2 bg-gray-800 text-white rounded"
      >
        GitHubでログインする
      </button>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        ログアウトする
      </button>
    </div>
  );
};

