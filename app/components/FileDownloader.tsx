'use client'
import { SignedUrlType } from "@/utils/constants";
import { useState } from "react";


export const FileDownloader: React.FC<FileProps> = ({ filePath, downloadFileName }) => {
  const [downloadStatus, setDownloadStatus] = useState<string>("");

  const handleDownload = async () => {
    if (!filePath) {
      alert("ファイルが選択されていません");
      return;
    }

    // 1. サーバーから署名付きURLを取得
    const res = await fetch("/api/signed-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filePath, action: SignedUrlType.Download }),
    });

    if (!res.ok) {
      setDownloadStatus("署名付きURL取得に失敗しました。");
      return;
    }

    const { signedUrl } = await res.json();

    // 2. 署名付きURLからファイルをダウンロード
    const downloadRes = await fetch(signedUrl);

    if (!downloadRes.ok) {
      setDownloadStatus("File download failed");
      return;
    }

    const blob = await downloadRes.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFileName || 'defaultFileName'; // ダウンロード時ファイル名
    document.body.appendChild(a);
    a.click();
    a.remove();

    setDownloadStatus("ファイルダウンロードに成功しました。");
  };

  return (
    <div>
      {/* <input
        type="text"
        placeholder="Enter file path (e.g., uploads/myfile.txt)"
        value={filePath}
        onChange={(e) => setFilePath(e.target.value)}
      /> */}
      <button onClick={handleDownload}>Download</button>
      <p>{downloadStatus}</p>
    </div>
  );
};

