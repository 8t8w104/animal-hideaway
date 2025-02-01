'use client'
import { FileDownloader } from "@/app/components/FileDownloader";
import { FileUploader } from "@/app/components/FileUploader";
import { generateFilePath } from "@/utils/path-utils";
import { Button } from "@mantine/core";

export const Regist = () => {

  const handleCreate = async () => {
    const testData = {
      animalTypeId: 1,
      name: "テスト動物",
      applicationStatus: "募集中",
      publicStatus: "下書き"
    }
    const res = await fetch("/api/regist", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });
    console.log(`insert res=${res}`);
    if (!res.ok) {
      console.log(`insert failed.`)
      return;
    }

  }

  const filePath = generateFilePath({ userId: "userId2", animalId: "animal2" });
  return (
    <>
      <Button onClick={handleCreate}>登録</Button>
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
