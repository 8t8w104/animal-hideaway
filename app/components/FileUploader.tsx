'use client'
import { SignedUrlType } from "@/utils/constants";
import { generateFilePath } from "@/utils/path-utils";
import { Button, Card, Center, Text } from "@mantine/core";
import { forwardRef, useState, useImperativeHandle } from "react";

export const FileUploader = forwardRef<{
  handleUpload: () => Promise<{ generatedFilePath: string, fileName: string }>,
  clear: () => void
}, UploadFileProps>(
  ({ userId }, ref) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>("");
    const [objectURL, setObjectURL] = useState<string>("");
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const fileObject = e.target.files[0];
        setFile(fileObject);
        setObjectURL(window.URL.createObjectURL(fileObject));
      }
    };

    const uploadFile = async () => {
      if (!file) {
        return;
      }

      try {
        const filePath = generateFilePath({ userId });
        const res = await fetch("/api/signed-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filePath, action: SignedUrlType.Upload }),
        });

        if (!res.ok) throw new Error("Failed to generate signed URL");

        const { signedUrl } = await res.json();
        const uploadResponse = await fetch(signedUrl, {
          method: "PUT",
          body: file,
        });

        if (!uploadResponse.ok) throw new Error("ファイルアップロードに失敗しました");

        return { generatedFilePath: filePath, fileName: file.name };
      } catch (error) {
        console.error(error);
        setUploadStatus("アップロード中にエラーが発生しました。");
        return null;
      } finally {
        setUploadStatus("ファイルアップロードに成功しました。");
      }
    };

    useImperativeHandle(ref, () => ({
      handleUpload: async () => {
        const result = await uploadFile();
        return result ?? { generatedFilePath: "", fileName: "" };
      },
      clear: () => {
        setFile(null)
        setObjectURL("")
        setUploadStatus("")
      }
    }));

    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Text mt="md" size="lg" style={{ weight: "500" }}>画像アップロード</Text>

        <input type="file" onChange={handleFileChange} accept="image/*" style={{ display: "none" }} id="file-upload" />
        <label htmlFor="file-upload">
          <Button component="span" size="md" variant="outline" c="blue" fullWidth>
            ファイルを選択
          </Button>
        </label>
        {objectURL && (
          <Center mt="md" style={{ border: '1px solid black' }}>
            <img src={objectURL} alt="Selected File" style={{ maxWidth: "100%", maxHeight: "200px" }} />
          </Center>
        )}
        {/* <Center mt="md">
          <Button onClick={handleUpload} loading={loading} color="teal" fullWidth>
            アップロード
          </Button>
        </Center> */}
        {uploadStatus && (
          <Text mt="md" c={uploadStatus.includes("成功") ? "blue" : "red"}>
            {uploadStatus}
          </Text>
        )}
      </Card>
    );
  });
