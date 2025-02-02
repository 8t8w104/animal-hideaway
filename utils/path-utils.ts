import { generateUUID } from "./uuid";

/**
 * ファイルパスを生成するメソッド
 * @param userId ユーザーID
 * @returns 生成されたファイルパス
 */
export const generateFilePath = ({ userId }: { userId: string }): string => {
  const uuid = generateUUID();
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const formattedTime = `${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}${String(date.getSeconds()).padStart(2, "0")}`;

  // /{ユーザーID}/{ランダムな文字列}{日付}_{時間}
  return `/${userId}/${uuid}/${formattedDate}_${formattedTime}`;
};
