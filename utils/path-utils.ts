import { generateUUID } from "./uuid";

/**
 * ファイルパスを生成するメソッド
 * @param userId ユーザーID
 * @param section 区分（1または2）
 * @param fileName ファイル名
 * @returns 生成されたファイルパス
 */
export const generateFilePath = (userId: string, section: 1 | 2, fileName: string): string => {
  const uuid = generateUUID();
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const formattedTime = `${String(date.getHours()).padStart(2, "0")}${String(date.getMinutes()).padStart(2, "0")}${String(date.getSeconds()).padStart(2, "0")}`;

  return `/${userId}/${section}/${uuid}/${formattedDate}_${formattedTime}_${fileName}`;
};
