'use client'
import { SignedUrlType } from "@/utils/constants";
import { generateFilePath } from "@/utils/path-utils";
import { Button, Group, Text, Loader, Card, Box, Center } from "@mantine/core";
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
      setUploadStatus("アップロード中にエラーが発生しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Text mt="md" size="lg" style={{ weight: "500" }}>画像アップロード</Text>

      <input type="file" onChange={handleFileChange} accept="image/*" style={{ display: "none" }} id="file-upload" />
      <label htmlFor="file-upload">
        <Button component="span" size="md" variant="outline" color="teal" fullWidth>
          ファイルを選択
        </Button>
      </label>
      {objectURL && (
        <Center mt="md" style={{ border: '1px solid black' }}>
          <img src={objectURL} alt="Selected File" style={{ maxWidth: "100%", maxHeight: "200px" }} />
        </Center>
      )}
      <Center mt="md">
        <Button onClick={handleUpload} loading={loading} color="teal" fullWidth>
          アップロード
        </Button>
      </Center>
      {uploadStatus && (
        <Text mt="md" c={uploadStatus.includes("成功") ? "green" : "red"}>
          {uploadStatus}
        </Text>
      )}
    </Card>
  );
};
