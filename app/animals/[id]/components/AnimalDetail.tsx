'use client';
import Image from 'next/image';
import { Card, Text, Container, Stack, Title, Paper, Button, TextInput, Grid, Select, ScrollArea, Group, Divider, Textarea, Center, ActionIcon, Tooltip, Loader } from '@mantine/core';
import { AnimalWithRelations } from '@/types/Animal';
import { IconInfoCircle, IconStar, IconStarFilled } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from "@/store/useUserStore";
import { Role } from '@/utils/constants';

export const AnimalDetail = ({ animal }: { animal: AnimalWithRelations }) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: animal.name,
    gender: animal.gender || '',
    description: animal.description || '',
    applicationStatus: animal.applicationStatus || '',
    publicStatus: animal.publicStatus || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const { role, userId } = useUserStore()
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingFavorite, setLoadingFavorite] = useState<boolean>(false);
  const [favorited, setFavorited] = useState(animal._count.IndividualAnimal ? true : false);
  const [applied, setApplied] = useState(animal._count.AdoptionApplication ? true : false);

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/animals/${animal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.refresh();
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }

  };

  const handleDelete = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/animals/${animal.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/');
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  };

  const handleFavorite = async () => {
    setLoadingFavorite(true);
    try {
      const res = await fetch(`/api/animals/${animal.id}/favorite`, {
        method: favorited ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {

        const data = await res.json();
        if (data.isFavoriteProcessed) {
          setFavorited(prev => !prev);
        }

        router.refresh();
      }

    } catch (error) {
      console.error('お気に入り操作エラー', error);
    } finally {
      setLoadingFavorite(prev => !prev);
      setLoading(false);
    }

  };

  const handleApply = async () => {
    setLoading(true)
    try {

      const res = await fetch(`/api/animals/${animal.id}/apply`, {
        method: applied ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data)

        if (data.isApplicationProcessed) {
          setApplied(prev => !prev);
        }
        if (data.isFavoriteProcessed) {
          setFavorited(prev => !prev);
        }
        router.refresh();
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }

  }

  return (
    <Container size="sm" py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Grid>
          <Grid.Col span={12}>
            <div style={{ position: "relative", width: "100%", maxWidth: "500px", height: "auto" }}>
              <Image
                src={animal.Image[0]?.imageUrl || "/assets/noImage.jpg"}
                alt={animal.name || "Default image"}
                layout="responsive"
                width={500}
                height={300}
                objectFit="cover"
                priority
              />
            </div>
          </Grid.Col>
          <Grid.Col span={12}>
            <Stack mt="md">
              <Text size="sm" color="dimmed">ID: {animal.id}</Text>
              {isEditing ? (
                <>
                  <TextInput label="名前" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
                  <Select
                    label="性別"
                    value={formData.gender}
                    onChange={(value) => handleChange('gender', value || '')}
                    data={[
                      { value: '', label: '選択なし' },
                      { value: 'オス', label: 'オス' },
                      { value: 'メス', label: 'メス' },
                      { value: '不明', label: '不明' },
                    ]}
                  />
                  <Textarea label="説明" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
                  <Select
                    label="応募ステータス"
                    value={formData.applicationStatus}
                    onChange={(value) => handleChange('applicationStatus', value || '')}
                    data={[
                      { value: '', label: '選択なし' },
                      { value: '募集中', label: '募集中' },
                      { value: '審査中', label: '審査中' },
                      { value: '決定', label: '決定' },
                    ]}
                  />
                  <Select
                    label="公開ステータス"
                    value={formData.publicStatus}
                    onChange={(value) => handleChange('publicStatus', value || '')}
                    data={[
                      { value: '', label: '選択なし' },
                      { value: '下書き', label: '下書き' },
                      { value: '公開', label: '公開' },
                      { value: '非公開', label: '非公開' },
                    ]}
                  />
                  <Button loading={loading} onClick={handleUpdate} color="blue">更新</Button>
                  <Button onClick={() => setIsEditing(false)} color="gray">キャンセル</Button>
                </>
              ) : (
                <>
                  <Title order={2}>{animal.name}</Title>
                  <Paper shadow="xs" p="md" radius="md" mt="sm">
                    <Text>{animal.description || <span>説明なし <IconInfoCircle size={14} stroke={1.5} /></span>}</Text>
                  </Paper>
                  <Text>性別: {animal.gender || '未設定'}</Text>
                  <Text>応募ステータス: {animal.applicationStatus || '未設定'}</Text>
                  <Text>公開ステータス: {animal.publicStatus || '未設定'}</Text>
                  {role === Role.Staff && (
                    <>
                      <Button onClick={() => setIsEditing(true)} color="blue">編集</Button>
                      <Button loading={loading} onClick={handleDelete} color="red">削除</Button>
                    </>
                  )}
                </>
              )}
            </Stack>
          </Grid.Col>
        </Grid>

        {/* お気に入り、応募 */}
        {role === Role.General &&
          <Center>
            <Group style={{ marginTop: '20px' }}>
              <Tooltip label={favorited ? 'お気に入り解除' : 'お気に入り登録'} withArrow>
                <ActionIcon
                  variant="transparent"
                  color={favorited ? 'yellow' : 'gray'}
                  size="xl"
                  onClick={handleFavorite}
                  disabled={loadingFavorite}
                >
                  {loadingFavorite ? (
                    <Loader size={24} color={favorited ? 'yellow' : 'gray'} />
                  ) : (
                    favorited ? <IconStarFilled size={24} /> : <IconStar size={24} />
                  )}
                </ActionIcon>
              </Tooltip>
              <Button
                color={applied ? 'gray' : 'green'}
                size="lg"
                onClick={handleApply}
                loading={loading}
              >
                {applied ? '応募済み' : '応募する'}
              </Button>
            </Group>
          </Center>
        }

      </Card>
    </Container>
  );
};
