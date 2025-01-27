
import { Animal, Gender } from '@prisma/client';
import { Animals } from './components/Animals';
import { redirect } from 'next/navigation';

import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

// /* 以降、アプリのテーブル定義 */
// enum Gender {
//   オス
//   メス
//   不明
// }

// enum ApplicationStatus {
//   募集中
//   審査中
//   決定
// }

// enum PublicStatus {
//   下書き
//   公開
//   非公開
// }

export type TodoType = {
  id: number;
  title: string;
  content: string;
  status: number;
  userId: string;
}

const data: Animal[] = [
  {
    id: 1,
    animalTypeId: 1,
    name: "name1",
    gender: Gender.オス,
    age: 3,
    description: "",
    applicationStatus: "募集中",
    publicStatus: "公開",
  },
  {
    id: 2,
    animalTypeId: 2,
    name: "name2",
    gender: Gender.不明,
    age: 3,
    description: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
    applicationStatus: "募集中",
    publicStatus: "公開",
  },
  {
    id: 3,
    animalTypeId: 2,
    name: "name3",
    gender: Gender.メス,
    age: 5,
    description: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
    applicationStatus: "募集中",
    publicStatus: "公開",
  },
]

export default async function Page() {


    const supabase = await createClient();
  
    // セッションを取得
    const { data: { session } } = await supabase.auth.getSession();
    console.log(session)
    console.log("↑  session")

    const { data: { user } } = await supabase.auth.getUser();
  console.log(user)
  console.log("↑  user")

  if(!session) {
    redirect('/login');
  }
  // ホスト情報を取得
  const baseUrl = process.env.SUPABASE_URL || 'http://localhost:3000';

  // TODO データベースから取得
    const res = await fetch(`${baseUrl}/api/animals`, {
      method: "GET",
      cache: 'no-store',
      headers: {
        // 'Authorization': `Bearer ${user?.id}`,
        'Authorization': `Bearer test`,
      },
    });
    const data = await res.json();
    console.log(data);
    console.log("↑一覧取得しました。");

  
  return (
    <>
      <Animals animals={data} />
    </>
  );
}
