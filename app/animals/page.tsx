import { Animal, Gender } from '@prisma/client';
import { Animals } from './components/Animals';


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

// const list = [
//   {
//     id: 1,
//     title: "title1",
//     content: "content1",
//     status: 1,
//     userId: "userId1",
//   },
//   {
//     id: 2,
//     title: "title2",
//     content: "content2",
//     status: 1,
//     userId: "userId2",
//   },
// ] as Animal

const list: Animal[] = [
  {
    id: 1,
    animalTypeId: 1,
    name: "name1",
    gender: Gender.オス,
    age: 3,
    description: "description1",
    applicationStatus: "募集中",
    publicStatus: "公開"
  }
]

export default async function Page() {

  return (
    <>
      <Animals animals={list} />
    </>
  );
}
