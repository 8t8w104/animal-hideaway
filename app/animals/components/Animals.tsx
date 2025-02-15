'use client';
import React, { useMemo, useState } from 'react';
import { Accordion, AspectRatio, Button, Card, Container, Flex, Grid, Image, Select, Stack, Text, TextInput, Title } from '@mantine/core';
import { AnimalWithRelations } from '@/types/Animal';
import { ApplicationStatus, Gender, PublicStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';

export const Animals = ({ initAnimals }: { initAnimals: AnimalWithRelations[] }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
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
    if (response.ok) setAnimals(await response.json());
  };

  const genderOptions = useMemo(() => [
    { value: '', label: '選択してください' },
    ...Object.values(Gender).map(item => ({ value: item, label: item }))
  ], []);

  const applicationStatusOptions = useMemo(() => [
    { value: '', label: '選択してください' },
    ...Object.values(ApplicationStatus).map(item => ({ value: item, label: item }))
  ], []);

  const publicStatusOptions = useMemo(() => {
    const options = [{ value: '', label: '選択してください' }];
    Object.values(PublicStatus).forEach(item => {
      if (item !== PublicStatus.非公開 || role === 'staff') {
        options.push({ value: item, label: item });
      }
    });
    return options;
  }, [role]);

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
                <TextInput label="名前" placeholder="名前を入力" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <Select label="性別" value={formData.gender} onChange={(value) => setFormData({ ...formData, gender: value || '' })} data={genderOptions} />
                <Select label="申請状況" value={formData.applicationStatus} onChange={v => setFormData({ ...formData, applicationStatus: v || '' })} data={applicationStatusOptions} />
                <Select label="公開状況" value={formData.publicStatus} onChange={(value) => setFormData({ ...formData, publicStatus: value || '' })} data={publicStatusOptions} />
                <Button type="submit">検索</Button>
              </Stack>
            </form>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      {/* 検索結果 */}
      <Grid mt="xl">
        {animals.map(animal => (
          <Grid.Col key={animal.id} span={{ base: 12, sm: 6, lg: 4 }}>
            <Card style={{ cursor: 'pointer' }} onClick={() => router.push(`/animals/${animal.id}`)}>
              <AspectRatio ratio={16 / 9}>
                <Image src={animal.Image[0]?.imageUrl || "/assets/noImage.jpg"} alt="Animal Image" radius="md" />
              </AspectRatio>
              <Text fw={"500"}>{animal.name}</Text>
              <Text size="xs" c="dimmed">{animal.gender} | {animal.applicationStatus} | {animal.publicStatus}</Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};
