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
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo
      },
    })
    if (error) console.error('Error logging in:', error.message);
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

