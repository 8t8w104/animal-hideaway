import { generateUUID } from "./uuid";

/**
 * ファイルパスを生成するメソッド
 * @param userId ユーザーID
 * @param animalId 動物ID
 * @returns 生成されたファイルパス
 */
export const generateFilePath = ({ userId, animalId }: { userId: string, animalId: string }): string => {
  const uuid = generateUUID();
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const formattedTime = `${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}${String(date.getSeconds()).padStart(2, "0")}`;

  // /{ユーザーID}/{動物ID}/{ランダムな文字列}{日付}_{時間}
  return `/${userId}/${animalId}/${uuid}/${formattedDate}_${formattedTime}`;
};
