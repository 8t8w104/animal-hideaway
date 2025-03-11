'use client';

import { Box, Button, Card, Center, Loader, Text } from "@mantine/core";
import { forwardRef, useImperativeHandle, useState } from "react";
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import { FreeMode, Navigation, Thumbs, Keyboard, Pagination } from 'swiper/modules';
import styles from './MultiFileUploader.module.css';
import { generateFilePath } from "@/utils/path-utils";
import { SignedUrlType } from "@/utils/constants";
import { UploadedFile } from "@/types/FileProps";

export const MultiFileUploader = forwardRef<{
  handleUpload: () => Promise<{ generatedFilePath: string; fileName: string }[]>;
  clear: () => void;
}, { userId: string }>(
  ({ userId }, ref) => {
    const [files, setFiles] = useState<UploadedFile[]>();
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [uploadStatus, setUploadStatus] = useState<string>("");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files?.length) {
        setThumbsSwiper(null);
        setFiles([]); // TODO 削除は別の契機とするか
        return;
      }

      let fileArray = Array.from(e.target.files);
      if (fileArray.length > 10) {
        const alertMessage = `${fileArray.length}枚選択されました。10枚目以降は読み込みません`
        alert(alertMessage);
        fileArray = fileArray.slice(0, 10);
      }

      const compressedFiles = await Promise.all(fileArray.map(async (file) => {
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        });
        return { file: compressedFile, url: URL.createObjectURL(compressedFile) };
      }));
      setFiles(compressedFiles);
    };

    const uploadFile = async (): Promise<{ generatedFilePath: string; fileName: string }[]> => {
      if (!files || !files.length) {
        return [];
      }

      try {
        const uploadedFiles: { generatedFilePath: string, fileName: string }[] = await Promise.all(
          files.map(async (file) => {
            setLoading(true);
            const filePath = generateFilePath({ userId });
            const res = await fetch("/api/signed-url", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ filePath, action: SignedUrlType.Upload }),
            });

            if (!res.ok) throw new Error("署名付きURL取得に失敗しました。");

            const { signedUrl } = await res.json();
            const uploadResponse = await fetch(signedUrl, {
              method: "PUT",
              body: file.file,
            });

            if (!uploadResponse.ok) throw new Error("ファイルアップロードに失敗しました");

            return {
              generatedFilePath: filePath,
              fileName: file.file?.name ?? "",
            };
          })
        );

        return uploadedFiles;
      } catch (error) {
        console.error(error);
        setUploadStatus("アップロード中にエラーが発生しました。");
        return [];
      } finally {
        setLoading(false);
        setUploadStatus("ファイルアップロードに成功しました。");
      }
    };

    useImperativeHandle(ref, () => ({
      handleUpload: uploadFile,
      clear: () => {
        // setFile(null)
        // setObjectURL("")
        // setUploadStatus("")
      }
    }));

    return (
      <Box className={styles.container}>
        <Card shadow="sm" padding="lg" radius="md" withBorder className={styles.card}>
          {Array.isArray(files) && (
            <Box m="md">
              <Swiper
                style={{
                  '--swiper-navigation-color': '#00FF00',
                } as React.CSSProperties}
                spaceBetween={10}
                navigation={true}
                keyboard={{
                  enabled: true,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                freeMode={true}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs, Keyboard, Pagination]}
                className={styles.mainSwiper}
                onSlideChange={(sw) => setActiveImageIndex(sw && !Number.isNaN(sw.activeIndex) ? sw.activeIndex : 0)}
              >
                {files.map((file, index) => (
                  <SwiperSlide key={index}>
                    <Image
                      src={file.url}
                      alt={`Uploaded ${index}`}
                      className={styles.mainImage}
                      width={300}
                      height={200}
                      style={{ objectFit: 'contain' }}
                      sizes="(max-width: 600px) 100vw, 300px"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={5}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className={styles.thumbSwiper}
              >
                {files.map((file, index) => (
                  <SwiperSlide key={index}>
                    {(index + 1)} / {files?.length}
                    <br />
                    <Box style={{
                      border: activeImageIndex === index ? " 2px solid red" : " 2px solid blue",
                      opacity: activeImageIndex === index ? 1 : 0.4
                    }}>
                      <img
                        src={file.url}
                        alt={`Thumbnail ${index}`}
                        className={styles.thumbImage} />
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>

            </Box>
          )}

          <Text size="lg" fw={500}>画像アップロード</Text>
          <Text c="gray" size="sm" mt="xs">
            最大 <Text span fw={700}>10枚</Text> までアップロードできます
          </Text>
          <Text c="gray" size="sm">
            (10枚目以降は読み込みません)
          </Text>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button component="span" size="md" variant="outline" color="blue" fullWidth>
              ファイルを選択
            </Button>
          </label>

          {loading && (
            <Center mt="md">
              <Loader />
            </Center>
          )}

          {uploadStatus && (
            <Text mt="md" c={uploadStatus.includes("成功") ? "blue" : "red"}>
              {uploadStatus}
            </Text>
          )}
        </Card>
      </Box >
    );
  }
);
