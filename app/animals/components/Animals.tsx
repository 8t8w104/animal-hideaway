'use client';
import React from 'react'
import classes from '../ArticlesCardsGrid.module.css';
import { Animal, Gender } from '@prisma/client';
import { AspectRatio, Button, Card, Center, Container, Flex, Image, NumberInput, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';


export const Animals = ({ animals }: { animals: Animal[] }) => {

  
  const cards = animals.map((article) => (
    <Card key={article.id} component="a" href="#" className={classes.card}>
      <Text>
        {article.name}
      </Text>
      <AspectRatio ratio={1920 / 1080} >
        <Image className={classes["image-wrapper"]} src={article.description || "/assets/noimage.png"} alt="Default image" width={400} height={300} />
      </AspectRatio>
      <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
        {article.animalTypeId}
      </Text>
      <Text />

      <Text>
        {article.gender}
      </Text>
      <Text>
        {article.applicationStatus}
      </Text>
      <Text>
        {article.publicStatus}
      </Text>

    </Card>
  ));

  
  return (
    <> 
      <Center>
        <Stack>
          <Title order={5} >検索条件</Title>
          <Flex>
            <TextInput

              label="Name"
              placeholder="Name"
              bg="lightgreen"
            />
            <TextInput
              bg="lightgreen"
              label="Email"
              placeholder="Email"

            />
            <NumberInput
              label="Age"
              placeholder="Age"
              min={0}
              max={99}
            />
            <Button>
              Submit
            </Button>
          </Flex>
        </Stack>
      </Center>
      <Container py="xl">
        <SimpleGrid cols={{ base: 1, sm: 2 }}>{cards}</SimpleGrid>
      </Container>
    </>
  );
}
