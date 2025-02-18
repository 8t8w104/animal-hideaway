"use client";

import { useRef, useState } from "react";
import { useForm } from "@mantine/form";
import { Container, Card, Stack, Title, Group, Divider, Button, TextInput, Select, NumberInput, Textarea, Modal, Box } from "@mantine/core";
import { FileUploader } from "@/app/components/FileUploader";
import { animalTypeOptions, applicationStatusOptions, genderOptions, publicStatusOptions } from "@/utils/options";
import { Animal, ApplicationStatus, Gender, PublicStatus } from "@prisma/client";

export const Regist = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const fileUploadRef = useRef<{
    handleUpload: () => Promise<{ generatedFilePath: string, fileName: string }>
    clear: () => void
  }>(null);

  const form = useForm({
    initialValues: {
      id: 0,
      name: "",
      gender: Gender.不明,
      animalTypeId: 0,
      age: 0,
      description: "",
      applicationStatus: ApplicationStatus.募集中,
      publicStatus: PublicStatus.下書き,
    } as Animal,

    validate: {
      name: (value) => (value.length > 0 ? null : "名前を入力してください"),
      animalTypeId: (value) => (value > 0 ? null : "種類を入力してください"),
    },
  });

  // 登録処理
  const handleCreate = async () => {
    if (!form.isValid()) return;

    setLoading(true);
    try {

      const uploadResult = await fileUploadRef.current?.handleUpload();
      if (!uploadResult) throw new Error("ファイルアップロードに失敗しました");

      const res = await fetch("/api/regist", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            ...form.values,
            userId,
            filePath: uploadResult?.generatedFilePath || "",
            fileName: uploadResult?.fileName || "",
          }
        ),
      });

      if (!res.ok) throw new Error("登録に失敗しました");
      setModalOpen(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={600} my="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2} mb="md" c="blue">動物登録</Title>
        <form onSubmit={form.onSubmit(handleCreate)}>
          <Stack gap="xl">
            <TextInput label="名前" {...form.getInputProps("name")} required />
            <Select
              label="種類"
              data={animalTypeOptions.map(opt => ({ value: String(opt.value), label: opt.label }))}
              {...form.getInputProps("animalTypeId")}
              required
            />
            <Select
              label="性別"
              data={genderOptions}
              {...form.getInputProps("gender")}
            />
            <NumberInput label="年齢" {...form.getInputProps("age")} min={0} />
            <Textarea label="説明" {...form.getInputProps("description")} />
            <Select label="応募状況" data={applicationStatusOptions} {...form.getInputProps("applicationStatus")} />
            <Select label="公開状況" data={publicStatusOptions} {...form.getInputProps("publicStatus")} />
            <FileUploader
              userId={userId}
              ref={fileUploadRef} />
            {/* <FileDownloader filePath={filePath} downloadFileName={fileName} /> */}
            <Group mt="md">
              <Button type="submit" loading={loading} size="lg" color="blue">
                登録
              </Button>
            </Group>
          </Stack>
        </form>
      </Card>

      <Divider my="xl" />

      {/* 登録成功後のモーダル */}
      <Modal
        opened={isModalOpen}
        onClose={() => {
          fileUploadRef.current?.clear();
          form.reset();
          setModalOpen(false)
        }}
        title="登録完了"
        centered
      >
        <p>動物が正常に登録されました！</p>
      </Modal>

    </Container>
  );
};
