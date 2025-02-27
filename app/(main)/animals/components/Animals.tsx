'use client';
import React, { useMemo, useState } from 'react';
import { Accordion, Box, Button, Card, Container, Grid, Select, Stack, Text, TextInput, Title } from '@mantine/core';
import { AnimalWithRelations } from '@/types/Animal';
import { PublicStatus } from '@prisma/client';
import { redirect, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { animalTypeOptions, applicationStatusOptions, genderOptions, publicStatusOptions } from '@/utils/options';
import Image from 'next/image';

export const Animals = ({ initAnimals }: { initAnimals: AnimalWithRelations[] }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    animalType: '',
    gender: '',
    applicationStatus: '',
    publicStatus: '',
  });
  const [animals, setAnimals] = useState<AnimalWithRelations[]>(initAnimals);
  const { role } = useUserStore();

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    const queryParams = new URLSearchParams(Object.entries(formData).filter(([_, v]) => v));
    const response = await fetch(`/api/animals?${queryParams}`);
    if (!response.ok) {
      redirect(`/error?message=${response.status}:${response.statusText}`);
    }
    setAnimals(await response.json());
  };

  const filterdPublicStatusOptions = useMemo(() => {
    const options: { value: string, label: string }[] = []; // 配列として初期化
    publicStatusOptions.forEach((opt) => {
      if (opt.value !== PublicStatus.非公開 || role === 'staff') {
        options.push({ value: String(opt.value), label: opt.label });
      }
    });
    return options;
  }, [role, publicStatusOptions]);

  return (
    <Container py="xl">
      <Accordion variant="separated" maw={500} mx="auto">
        <Accordion.Item value="search">
          <Accordion.Control>
            <Title order={5}>検索条件</Title>
          </Accordion.Control>
          <Accordion.Panel>
            <form onSubmit={handleSearch}>
              <Stack>
                <TextInput
                  label="名前"
                  placeholder="名前を入力"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Select
                  label="種類"
                  value={formData.animalType}
                  onChange={value => setFormData({ ...formData, animalType: value || '' })}
                  data={animalTypeOptions.map((opt) => ({
                    value: String(opt.value), label: opt.label,
                  }))}
                />
                <Select
                  label="性別"
                  value={formData.gender}
                  onChange={(value) => setFormData({ ...formData, gender: value || '' })}
                  data={genderOptions}
                />
                <Select
                  label="申請状況"
                  value={formData.applicationStatus}
                  onChange={value => setFormData({ ...formData, applicationStatus: value || '' })}
                  data={applicationStatusOptions.map((opt) => ({
                    value: String(opt.value),
                    label: opt.label,
                  }))}
                />
                <Select
                  label="公開状況"
                  value={formData.publicStatus}
                  onChange={(value) => setFormData({ ...formData, publicStatus: value || '' })}
                  data={filterdPublicStatusOptions}
                />
                <Button type="submit">検索</Button>
              </Stack>
            </form>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      {/* 検索結果 */}
      <Grid mt="xl">
        {animals.map(animal => (
          <Grid.Col
            key={animal.id}
            span={{ base: 12, sm: 6, lg: 5 }}
            bg="#f8f9fa"
            p="md"
            m="md"
            style={{ borderRadius: '8px' }}
          >
            <Card
              bg="white"
              shadow="sm"
              radius={8}
              style={{ cursor: 'pointer' }}
              onClick={() => router.push(`/animals/${animal.id}`)}
            >
              <Box
                w={"100%"}
                h={300}
                bd="2px dashed #f8f9fa"
                pos={"relative"}
                style={{ borderRadius: "10px" }}
              >
                <Image
                  src={animal.Image[0]?.imageUrl || '/assets/noImage.jpg'}
                  alt="Animal Image"
                  sizes="(max-width: 600px) 100vw, 300px"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </Box>
              <Text fw={"600"} size="lg" c="dark" mt="sm">
                {animal.name}
              </Text>
              <Text size="xs" c="dimmed">
                {animal.gender} | {animal.applicationStatus} | {animal.publicStatus}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};
