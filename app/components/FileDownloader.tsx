'use client'
import { SignedUrlType } from "@/utils/constants";
import { Button, Text, Box, Card } from "@mantine/core";
import { useState } from "react";


export const FileDownloader: React.FC<DownloadFileProps> = ({ filePath, downloadFileName }) => {
  const [downloadStatus, setDownloadStatus] = useState<string>("");

  const handleDownload = async () => {
    if (!filePath) {
      alert("ファイルが選択されていません");
      return;
    }

    try {
      setDownloadStatus("ダウンロード中...");

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
        setDownloadStatus("ファイルダウンロードに失敗しました");
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
    } catch (error) {
      console.error(error);
      setDownloadStatus("ダウンロード中にエラーが発生しました。");
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text size="lg" style={{ weight: "500" }}  >画像ダウンロード</Text>
      <Box mt="md">
        <Button onClick={handleDownload} size="md" color="teal" variant="filled" fullWidth>
          ダウンロード
        </Button>
      </Box>
      {downloadStatus && (
        <Text mt="md" c={downloadStatus.includes("成功") ? "green" : "red"}>
          {downloadStatus}
        </Text>
      )}
    </Card>
  );
};

