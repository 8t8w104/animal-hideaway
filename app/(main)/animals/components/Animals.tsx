'use client';
import React, { useMemo, useState } from 'react';
import { Accordion, Box, Button, Card, Container, Grid, MultiSelect, Select, Stack, Text, TextInput, Title } from '@mantine/core';
import { AnimalWithRelations } from '@/types/Animal';
import { PublicStatus } from '@prisma/client';
import { redirect, useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { animalTypeOptions, applicationStatusOptions, genderOptions, publicStatusOptions } from '@/utils/options';
import Image from 'next/image';

export const Animals = ({ initAnimals }: { initAnimals: AnimalWithRelations[] }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    name: string;
    animalType: string[];
    gender: string[];
    applicationStatus: string[];
    publicStatus: string[];
  }>({
    name: '',
    animalType: [],
    gender: [],
    applicationStatus: [],
    publicStatus: [],
  });
  const [animals, setAnimals] = useState<AnimalWithRelations[]>(initAnimals);
  const { role } = useUserStore();
  const [accordionValue, setAccordionValue] = useState<string | null>(null);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    // const queryParams = new URLSearchParams(Object.entries(formData).filter(([_, v]) => v));
    // const response = await fetch(`/api/animals?${queryParams}`);
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        value.forEach(v => params.append(key, v));
      } else if (typeof value === 'string' && value) {
        params.append(key, value);
      }
    });
    const response = await fetch(`/api/animals?${params}`);
    if (!response.ok) {
      redirect(`/error?message=${response.status}:${response.statusText}`);
    }
    setAnimals(await response.json());
    setAccordionValue(null);
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
      <Accordion
        bg="var(--bg-color)"
        maw={500}
        mx="auto"
        value={accordionValue}
        onChange={setAccordionValue}
      >
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
                <MultiSelect
                  label="種類"
                  value={formData.animalType}
                  onChange={value => setFormData({ ...formData, animalType: value })}
                  data={animalTypeOptions.map((opt) => ({
                    value: String(opt.value), label: opt.label,
                  }))}
                />
                <MultiSelect
                  label="性別"
                  value={formData.gender}
                  onChange={(value) => setFormData({ ...formData, gender: value })}
                  data={genderOptions}
                />
                <MultiSelect
                  label="申請状況"
                  value={formData.applicationStatus}
                  onChange={value => setFormData({ ...formData, applicationStatus: value })}
                  data={applicationStatusOptions.map((opt) => ({
                    value: String(opt.value),
                    label: opt.label,
                  }))}
                />
                <MultiSelect
                  label="公開状況"
                  value={formData.publicStatus}
                  onChange={(value) => setFormData({ ...formData, publicStatus: value })}
                  data={filterdPublicStatusOptions}
                />
                <Button type="submit">検索</Button>
              </Stack>
            </form>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      {/* 検索結果 */}
      <Grid mt="xl" justify="center">
        {animals.map(animal => (
          <Grid.Col
            key={animal.id}
            span={{ base: 11, sm: 6, lg: 5 }}
            bg="var(--bg-color)"
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
                性別：{animal.gender} | 状況：{animal.applicationStatus}
                {/* {animal.publicStatus} */}
              </Text>


              <Text size="xs" c="dimmed">
                保護職員：{animal.OrganizationAnimal?.[0]?.organization?.name}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};
