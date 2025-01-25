import { createClient } from "@/utils/supabase/client";



export const Auth = () => {

  const handleLogin = async (provider: 'google' | 'github') => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) console.error('Error logging in:', error.message);
  };

  const handleLogout = async () => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={() => handleLogin('google')}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Login with Google
      </button>
      <button
        onClick={() => handleLogin('github')}
        className="px-4 py-2 bg-gray-800 text-white rounded"
      >
        Login with GitHub
      </button>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
};

