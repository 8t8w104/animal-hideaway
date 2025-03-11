'use client';

import { Box, Card, Text } from "@mantine/core";
import { useState } from "react";
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import { FreeMode, Navigation, Thumbs, Keyboard, Pagination } from 'swiper/modules';
import styles from './FileViewer.module.css';
import { UploadedFile } from "@/types/FileProps";

export const FileViewer = ({ savedFiles }: { savedFiles: UploadedFile[] }) => {
  const [files] = useState<UploadedFile[]>(savedFiles);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  return (
    <Box className={styles.container}>
      <Card shadow="sm" padding="lg" radius="md" withBorder className={styles.card}>
        <Text size="lg" fw={500}>写真</Text>
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
      </Card>
    </Box >
  );
}
