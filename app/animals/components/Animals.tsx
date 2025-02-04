'use client';
import React, { useMemo, useState } from 'react'

import { AspectRatio, Button, Card, Center, Container, Flex, Image, NumberInput, Select, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';
import classes from '../ArticlesCardsGrid.module.css';
import { AnimalWithRelations } from '@/types/Animal';
import { Gender } from '@prisma/client';
import { useRouter } from 'next/navigation';

export const Animals = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
  });
  const [animals, setAnimals] = useState<AnimalWithRelations[]>();

  const cards = animals?.map((animal) => {

    const formattedAnimal = {
      ...animal,
      animalTypeName: animal.animalType.type
    };

    return (
      <Card
        key={animal.id}
        className="card"
        onClick={() => handleCardClick(animal.id)}
        component="a"
        style={{ cursor: 'pointer' }}
      >

        <Text>
          {formattedAnimal.name}
        </Text>
        <AspectRatio ratio={1920 / 1080} >
          <Image className={classes["image-wrapper"]} src={formattedAnimal.Image[0]?.imageUrl || "/assets/noImage.jpg"} alt="Default image" width={400} height={300} />
        </AspectRatio>
        <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
          {formattedAnimal.animalTypeName}
        </Text>
        <Text />

        <Text>
          {formattedAnimal.gender}
        </Text>
        <Text>
          {formattedAnimal.applicationStatus}
        </Text>
        <Text>
          {formattedAnimal.publicStatus}
        </Text>

      </Card>
    )
  });

  const handleCardClick = (animalId: number) => {
    router.push(`/animals/${animalId}`);
  };

  // 検索条件に基づくAPIリクエストの実行
  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault(); // フォームのデフォルトの送信動作を防ぐ

    console.log("handleSearch")
    const queryParams = new URLSearchParams();

    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        queryParams.append(key, value.toString());
      }
    });

    console.log(queryParams);
    console.log("↑queryParams");

    const response = await fetch(`/api/animals?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const animals = await response.json();
      setAnimals(animals);
    }
  };


  const genderOptions = useMemo(() => [
    { value: '', label: '選択してください' },
    ...Object.values(Gender).map((gender) => ({
      value: gender,
      label: gender
    }))
  ], []);


  return (

    <>
      <Center>
        <Stack>
          <Title order={5} >検索条件</Title>
          <form onSubmit={handleSearch}>
            <Flex>
              <TextInput

                label="Name"
                placeholder="Name"
                bg="lightgreen"

                value={formData.name}
                onChange={(event) => setFormData(prev => ({
                  ...prev,
                  name: event.target.value
                }))}

              />
              {/* <TextInput
                bg="lightgreen"
                label="Email"
                placeholder="Email"

              />
              <NumberInput
                label="Age"
                placeholder="Age"
                min={0}
                max={99}
              /> */}
              <Select
                label="性別"
                value={formData.gender}
                onChange={(value) => setFormData({
                  ...formData,
                  gender: value || ''
                })}
                data={genderOptions}
              />
              <Button type="submit">
                Submit
              </Button>
            </Flex>
          </form>
        </Stack>
      </Center >
      <Container py="xl">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>{cards}</SimpleGrid>
      </Container>
    </>

  );
}
