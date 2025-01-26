import { Animal, Gender } from '@prisma/client';
import { Animals } from './components/Animals';
import { AspectRatio, Button, Card, Center, Container, Flex, Image, NumberInput, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';
import classes from './ArticlesCardsGrid.module.css';

// /* 以降、アプリのテーブル定義 */
// enum Gender {
//   オス
//   メス
//   不明
// }

// enum ApplicationStatus {
//   募集中
//   審査中
//   決定
// }

// enum PublicStatus {
//   下書き
//   公開
//   非公開
// }

export type TodoType = {
  id: number;
  title: string;
  content: string;
  status: number;
  userId: string;
}

// const list = [
//   {
//     id: 1,
//     title: "title1",
//     content: "content1",
//     status: 1,
//     userId: "userId1",
//   },
//   {
//     id: 2,
//     title: "title2",
//     content: "content2",
//     status: 1,
//     userId: "userId2",
//   },
// ] as Animal

// const mockdata = [
//   {
//     title: 'Top 10 places to visit in Norway this summer',
//     image:
//       'https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80',
//     date: 'August 18, 2022',
//   },
// ];

const data: Animal[] = [
  {
    id: 1,
    animalTypeId: 1,
    name: "name1",
    gender: Gender.オス,
    age: 3,
    description: "",
    applicationStatus: "募集中",
    publicStatus: "公開",
  },
  {
    id: 2,
    animalTypeId: 2,
    name: "name2",
    gender: Gender.不明,
    age: 3,
    description: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
    applicationStatus: "募集中",
    publicStatus: "公開",
  },
  {
    id: 3,
    animalTypeId: 2,
    name: "name3",
    gender: Gender.メス,
    age: 5,
    description: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=720&q=80",
    applicationStatus: "募集中",
    publicStatus: "公開",
  },
]

export default async function Page() {



  const cards = data.map((article) => (
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
      {/* <Animals animals={list} /> */}

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
