// import { Card, Image, Text, Badge, Group, Container, Stack, Title, Paper } from '@mantine/core';
// import { AnimalWithRelations } from '@/types/Animal';
// import { IconInfoCircle } from '@tabler/icons-react';

// export const AnimalsDetail = ({ animal }: { animal: AnimalWithRelations }) => {
//   console.log(animal);

//   return (
//     <Container size="sm" py="xl">
//       <Card shadow="sm" padding="lg" radius="md" withBorder>
//         {/* 画像 */}
//         <Image
//           // src={animal.description || "/assets/noImage.jpg"}
//           src={"/assets/noImage.jpg"}
//           height={300}
//           alt={animal.name}
//           radius="md"
//         />
//         <Stack mt="md">
//           {/* ID */}
//           <Text size="sm" color="dimmed">ID: {animal.id}</Text>

//           {/* 名前 */}
//           <Title order={2}>{animal.name}</Title>

//           {/* 性別 & 年齢 */}
//           <Group>
//             <Badge size="lg" variant="light">
//               {animal.gender || '情報なし'}
//             </Badge>

//             <Badge size="lg" color={animal.age !== null ? 'blue' : 'gray'}>
//               年齢: {animal.age !== null && animal.age !== undefined ? `${animal.age} 歳` : <span>情報なし <IconInfoCircle size={14} stroke={1.5} /></span>}
//             </Badge>
//           </Group>

//           {/* ステータス */}
//           <Group mt="xs">
//             <Badge color={animal.applicationStatus === "募集中" ? "green" : "red"}>
//               {animal.applicationStatus || <span>情報なし <IconInfoCircle size={14} stroke={1.5} /></span>}
//             </Badge>
//             <Badge color={animal.publicStatus === "下書き" ? "blue" : "gray"}>
//               {animal.publicStatus || <span>情報なし <IconInfoCircle size={14} stroke={1.5} /></span>}
//             </Badge>
//           </Group>

//           {/* 説明 */}
//           <Paper shadow="xs" p="md" radius="md" mt="sm">
//             <Text>{animal.description || <span>説明なし <IconInfoCircle size={14} stroke={1.5} /></span>}</Text>
//           </Paper>
//         </Stack>
//       </Card>
//     </Container>
//   );
// };
