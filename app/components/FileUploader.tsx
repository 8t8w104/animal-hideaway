'use client'
import { useState } from "react";

export const FileUploader: React.FC<FileProps> = ({ filePath }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    // 署名付きURL取得
    const res = await fetch("/api/signed-url", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ filePath }),
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
    } else {
      setUploadStatus(`ファイルアップロードに失敗しました。statusText=${uploadResponse.statusText}`);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{uploadStatus}</p>
    </div>
  );
};
