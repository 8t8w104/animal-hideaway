'use client'
import { SignedUrlType } from "@/utils/constants";
import { generateFilePath } from "@/utils/path-utils";
import { Button, Card, Center, Text, Loader } from "@mantine/core";
import { forwardRef, useState, useImperativeHandle } from "react";
import imageCompression from 'browser-image-compression';
import Image from 'next/image';

export const FileUploader = forwardRef<{
  handleUpload: () => Promise<{ generatedFilePath: string, fileName: string }>,
  clear: () => void
}, UploadFileProps>(
  ({ userId }, ref) => {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<string>("");
    const [objectURL, setObjectURL] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const fileObject = e.target.files[0];
        const compressedFile = await imageCompression(fileObject, {
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true
        });
        setFile(compressedFile);
        setObjectURL(window.URL.createObjectURL(compressedFile));
      }
    };

    const uploadFile = async () => {
      if (!file) {
        return;
      }

      try {
        setLoading(true);
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
        setLoading(false);
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
        <Text mt="md" size="lg" fw={500}>画像アップロード</Text>
        <input type="file" onChange={handleFileChange} accept="image/*" style={{ display: "none" }} id="file-upload" />
        <label htmlFor="file-upload">
          <Button component="span" size="md" variant="outline" color="blue" fullWidth>
            ファイルを選択
          </Button>
        </label>

        {loading ? (
          <Center mt="md">
            <Loader />
          </Center>
        ) : (
          objectURL && (
            <Center mt="md">
              <Image
                src={objectURL}
                alt="Selected File"
                width={300}
                height={200}
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 600px) 100vw, 300px"
              />
            </Center>
          )
        )}

        {uploadStatus && (
          <Text mt="md" c={uploadStatus.includes("成功") ? "blue" : "red"}>
            {uploadStatus}
          </Text>
        )}
      </Card>
    );
  });
