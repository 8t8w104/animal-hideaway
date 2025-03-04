"use client";

import { useRef, useState } from "react";
import { useForm } from "@mantine/form";
import { Container, Card, Stack, Title, Group, Divider, Button, TextInput, Select, NumberInput, Textarea, Modal, Box } from "@mantine/core";
import { FileUploader } from "@/app/components/FileUploader";
import { animalTypeOptions, applicationStatusOptions, genderOptions, publicStatusOptions } from "@/utils/options";
import { Animal, ApplicationStatus, Gender, PublicStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { notifications } from '@mantine/notifications';

export const Regist = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const fileUploadRef = useRef<{
    handleUpload: () => Promise<{ generatedFilePath: string, fileName: string }>
    clear: () => void
  }>(null);
  const router = useRouter();

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

      notifications.show({
        title: '成功',
        message: '動物が正常に登録されました。',
        color: 'green',
        position: 'top-center'
      });

      router.push("/")
    } catch (error) {
      console.error(error);
      notifications.show({
        title: '失敗',
        message: '登録に失敗しました。',
        color: 'red',
        position: 'top-center'
      });
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

    </Container>
  );
};
