"use client";

import { useState } from "react";
import { useForm } from "@mantine/form";
import { Container, Card, Stack, Title, Group, Divider, Button, TextInput, Select, NumberInput, Textarea, Modal, } from "@mantine/core"
import { FileDownloader } from "@/app/components/FileDownloader";
import { FileUploader } from "@/app/components/FileUploader";
import { generateFilePath } from "@/utils/path-utils";
import { animalTypeOptions, applicationStatusOptions, genderOptions, publicStatusOptions } from "@/utils/options";
import { Animal, ApplicationStatus, Gender, PublicStatus } from "@prisma/client";

export const Regist = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [filePath, setFilePath] = useState<string>();
  const [fileName, setFileName] = useState<string>();

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
    },
  });

  // 登録処理
  const handleCreate = async () => {
    if (!form.isValid()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/regist", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          {
            ...form.values,
            userId,
            filePath,
            fileName
          }
        ),
      });

      console.log(res)
      console.log("↑res")

      if (!res.ok) throw new Error("登録に失敗しました");
      console.log("登録成功");
      setModalOpen(true);
      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 子コンポーネントで生成したファイルパスを受け取る
  const onFilePathReceived = ({ generatedFilePath, fileName }: { generatedFilePath: string, fileName: string }) => {
    setFilePath(generatedFilePath);
    setFileName(fileName);
  };

  return (
    <Container size={600} my="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={2} mb="md">動物登録</Title>
        <form onSubmit={form.onSubmit(handleCreate)}>
          <Stack>
            <TextInput label="名前" {...form.getInputProps("name")} required />
            <Select label="種類"
              data={animalTypeOptions.map((opt) => ({
                value: String(opt.value), label: opt.label,
              }))}
              {...form.getInputProps("animalTypeId")} />
            <Select label="性別" data={genderOptions} {...form.getInputProps("gender")} />
            <NumberInput label="年齢" {...form.getInputProps("age")} min={0} />
            <Textarea label="説明" {...form.getInputProps("description")} />
            <Select label="応募状況" data={applicationStatusOptions} {...form.getInputProps("applicationStatus")} />
            <Select label="公開状況" data={publicStatusOptions} {...form.getInputProps("publicStatus")} />
            <Group mt="md" >
              <Button type="submit" loading={loading}>
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
        onClose={() => setModalOpen(false)}
        title="登録完了"
        centered
      >
        <p>動物が正常に登録されました！</p>
      </Modal>

      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} >画像アップロード</Title>
        <FileUploader userId={userId} onFileDataReceivedAction={onFilePathReceived} />
      </Card>

      <Card shadow="sm" padding="lg" radius="md" withBorder mt="md">
        <Title order={3} >画像ダウンロード</Title>
        <FileDownloader filePath={filePath} downloadFileName={fileName} />
      </Card>
    </Container>
  );
};
