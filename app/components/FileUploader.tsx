'use client'
import { SignedUrlType } from "@/utils/constants";
import { generateFilePath } from "@/utils/path-utils";
import { Button, Group } from "@mantine/core";
import { useState } from "react";

export const FileUploader: React.FC<UploadFileProps> = ({ userId, onFileDataReceivedAction }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [objectURL, setObjectURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileObject = e.target.files[0];
      setFile(fileObject);
      setObjectURL(window.URL.createObjectURL(fileObject));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }
    try {
      setLoading(true);

      const filePath = generateFilePath({ userId });

      // 署名付きURL取得
      const res = await fetch("/api/signed-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath, action: SignedUrlType.Upload }),
      });
      console.log(`res=${res}`);
      if (!res.ok) {
        setUploadStatus("Failed to generate signed URL");
        return;
      }

      const { signedUrl } = await res.json();
      console.log(`signedUrl=${signedUrl}`)
      // 署名付きURLにファイルをアップロード
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
      });

      console.log(uploadResponse);
      console.log(`↑uploadResponse`);
      if (uploadResponse.ok) {
        setUploadStatus("ファイルアップロードに成功しました。");
        console.log(file.name)
        onFileDataReceivedAction({ generatedFilePath: filePath, fileName: file.name })
      } else {
        setUploadStatus(`ファイルアップロードに失敗しました。statusText=${uploadResponse.statusText}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>upload</button>

      <Group mt="md" >
        <Button onClick={handleUpload} loading={loading}>
          アップロードする
        </Button>
      </Group>

      <img src={objectURL || undefined} alt="test" style={{ width: "200px", height: "200px" }} />
      <p>{uploadStatus}</p>
    </div>
  );
};
