'use client'
import { FileDownloader } from "@/app/components/FileDownloader";
import { FileUploader } from "@/app/components/FileUploader";
import { generateFilePath } from "@/utils/path-utils";

export const Regist = () => {
  const filePath = generateFilePath({ userId: "userId2", animalId: "animal2" });
  return (
    <>
      <div>
        <h1>画像アップロード</h1>
        <FileUploader filePath={filePath} />
      </div>
      <div>
        <h1>画像ダウンロード</h1>
        <FileDownloader filePath={filePath} downloadFileName="ハムスター1.png" />
      </div>
    </>
  );
}
