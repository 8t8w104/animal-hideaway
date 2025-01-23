'use client'
import { FileDownloader } from "@/app/components/FileDownloader";
import { FileUploader } from "@/app/components/FileUploader";
import { generateFilePath } from "@/utils/path-utils";
import { SetStateAction, useState } from "react";

// /{ユーザーID}/{区分}/{日付}_{時間}_{ランダムな文字列}.{拡張子}
export const TestFile = () => {
  const filePath = generateFilePath("userId1", 1, "fileName1");
  console.log(`filePath=${filePath}`);
  return (
    <>
      <div>
        <h1>画像アップロード</h1>
        <FileUploader filePath={filePath} />
      </div>
      <div>
        <h1>画像ダウンロード</h1>
        <FileDownloader filePath={filePath} />
      </div>
    </>
  );
}
