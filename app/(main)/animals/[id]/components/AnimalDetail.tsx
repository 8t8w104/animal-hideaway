'use client';
import Image from 'next/image';
import { Card, Text, Container, Stack, Title, Paper, Button, TextInput, Grid, Select, ScrollArea, Group, Divider, Textarea, Center, ActionIcon, Tooltip, Loader, Box } from '@mantine/core';
import { AnimalWithRelations } from '@/types/Animal';
import { IconInfoCircle, IconStar, IconStarFilled } from '@tabler/icons-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from "@/store/useUserStore";
import { Role } from '@/utils/constants';
import { ApplicationStatus } from '@prisma/client';
import { notifications } from '@mantine/notifications';

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

  const [loadingStates, setLoadingStates] = useState({
    update: false,
    delete: false,
    favorite: false,
    apply: false,
    decide: false,
  });

  const [status, setStatus] = useState({
    favorite: animal._count?.IndividualAnimal > 0,
    application: animal._count?.AdoptionApplication > 0,
    decided: animal.applicationStatus === ApplicationStatus.決定,
  });

  const handleChange = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  // 動物編集（職員）
  const handleUpdate = async () => {
    setLoadingStates(prev => ({ ...prev, update: true }));
    try {
      const res = await fetch(`/api/animals/${animal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId
        }),
      });
      if (res.ok) {
        router.refresh();
        setIsEditing(false);

        notifications.show({
          title: '成功',
          message: '更新に成功しました。',
          color: 'green',
          position: 'top-center'
        });
      }
    } catch (error) {
      console.log(error)
      notifications.show({
        title: '失敗',
        message: '更新に失敗しました。',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, update: false }));
    }

  };

  // 動物削除（職員）
  const handleDelete = async () => {
    setLoadingStates(prev => ({ ...prev, delete: true }));
    try {
      const res = await fetch(`/api/animals/${animal.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (res.ok) {
        router.push('/');

        notifications.show({
          title: '成功',
          message: '削除に成功しました。',
          color: 'green',
          position: 'top-center'
        });
      }
    } catch (error) {
      console.log(error)
      notifications.show({
        title: '失敗',
        message: '削除に失敗しました。',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, delete: false }));
    }
  };

  // 職員操作：ステータス更新（審査中→決定）
  const handleDecided = async () => {
    setLoadingStates(prev => ({ ...prev, decide: true }));
    try {

      const res = await fetch(`/api/animals/${animal.id}/decided`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          decided: status.decided,
        }),
      });

      if (res.ok) {
        setStatus(prev => ({ ...prev, decided: !prev.decided }));
        router.refresh();
        setIsEditing(false);


        notifications.show({
          title: '成功',
          message: `${status.decided ? '決定を取り消しました。' : '決定しました。'}`,
          color: 'green',
          position: 'top-center'
        });
      }
    } catch (error) {
      console.log(error)
      notifications.show({
        title: '失敗',
        message: '更新に失敗しました。',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, decide: false }));
    }
  }

  // お気に入り（一般）
  const handleFavorite = async () => {
    setLoadingStates(prev => ({ ...prev, favorite: true }));
    try {
      const res = await fetch(`/api/animals/${animal.id}/favorite`, {
        method: status.favorite ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {

        const data = await res.json();
        if (data.isFavoriteProcessed) {
          setStatus(prev => ({ ...prev, favorite: !prev.favorite }));
        }

        router.refresh();

        notifications.show({
          title: '成功',
          message: 'お気に入り登録に成功しました。',
          color: 'green',
          position: 'top-center'
        });
      }

    } catch (error) {
      console.error('お気に入り操作エラー', error);
      notifications.show({
        title: '失敗',
        message: 'お気に入り登録に失敗しました。',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, favorite: false }));
    }

  };

  // 一般ユーザ操作：ステータス更新（募集中→審査中）
  const handleApply = async () => {
    setLoadingStates(prev => ({ ...prev, apply: true }))
    try {

      const res = await fetch(`/api/animals/${animal.id}/apply`, {
        method: status.application ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data)

        if (data.isApplicationProcessed) {
          setStatus(prev => ({ ...prev, application: !prev.application }));
        }
        if (data.isFavoriteProcessed) {
          setStatus(prev => ({ ...prev, favorite: !prev.favorite }));
        }
        router.refresh();
        setIsEditing(false);

        notifications.show({
          title: '成功',
          message: '応募しました。',
          color: 'green',
          position: 'top-center'
        });
      }
    } catch (error) {
      console.log(error)
      notifications.show({
        title: '失敗',
        message: '応募に失敗しました。',
        color: 'red',
        position: 'top-center'
      });
    } finally {
      setLoadingStates(prev => ({ ...prev, apply: false }))
    }

  }

  return (
    <Container size="sm" py="xl">
      <Card shadow="sm" padding="lg" radius="md" withBorder bg="var(--bg-color)">
        <Grid>
          <Grid.Col span={12} bg="white" style={{ borderRadius: "12px" }}>
            <Box
              w={"100%"}
              h={400}
              bd="2px dashed #f8f9fa"
              pos={"relative"}
              style={{ borderRadius: "12px" }}
            >
              <Image
                src={animal.Image[0]?.imageUrl || '/assets/noImage.jpg'}
                alt={animal.name}
                sizes="(max-width: 600px) 100vw, 500px"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
          </Grid.Col>
          <Grid.Col span={12}>
            <Stack mt="md" gap="md">
              <Text c="dimmed">ID: {animal.id}</Text>
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
                  <Textarea
                    label="説明"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    autosize
                    minRows={3}
                  />
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
                </>
              ) : (
                <>
                  <Title order={2}>{animal.name}</Title>
                  <Stack gap={0}>
                    <Text size="lg" fw={600}>説明</Text>
                    {animal.description ? (
                      <Text bg={"white"} style={{ whiteSpace: 'pre-wrap', borderRadius: "12px" }}>
                        {animal.description}
                      </Text>
                    ) : (
                      <Text>
                        説明なし <IconInfoCircle size={14} stroke={1.5} />
                      </Text>
                    )}
                  </Stack>
                  <Text>性別: {animal.gender || '未設定'}</Text>
                  <Text>応募ステータス: {animal.applicationStatus || '未設定'}</Text>
                  <Text>公開ステータス: {animal.publicStatus || '未設定'}</Text>
                </>
              )}
            </Stack>
          </Grid.Col>
        </Grid>

        {/* お気に入り、応募 */}
        {role === Role.General &&
          <Center>
            <Group style={{ marginTop: '20px' }}>
              <Tooltip label={status.favorite ? 'お気に入り解除' : 'お気に入り登録'} withArrow>
                <ActionIcon
                  variant="transparent"
                  color={status.favorite ? 'yellow' : 'gray'}
                  size="xl"
                  onClick={handleFavorite}
                  disabled={loadingStates.favorite}
                >
                  {loadingStates.favorite ? (
                    <Loader size={24} color={status.favorite ? 'yellow' : 'gray'} />
                  ) : (
                    status.favorite ? <IconStarFilled size={24} /> : <IconStar size={24} />
                  )}
                </ActionIcon>
              </Tooltip>
              <Button
                color={status.application ? 'gray' : 'green'}
                size="lg"
                onClick={handleApply}
                loading={loadingStates.apply}
              >
                {status.application ? '応募済み' : '応募する'}
              </Button>
            </Group>
          </Center>
        }

        {role === Role.Staff && (
          <>
            <Center>
              <Text size="sm" c="dimmed" mt="xl">動物情報の編集や削除はこちら</Text>
            </Center>
            <Center>
              <Group>
                {isEditing ? (
                  <>
                    <Button size="lg" loading={loadingStates.update} onClick={handleUpdate} color="blue">更新する</Button>
                    <Button size="lg" onClick={() => setIsEditing(false)} color="gray">やっぱりやめる</Button>
                  </>
                ) : (
                  <>
                    <Button size="lg" onClick={() => setIsEditing(true)} color="blue">編集する</Button>
                    <Button size="lg" loading={loadingStates.delete} onClick={handleDelete} color="red">削除する</Button>
                  </>
                )}
              </Group>
            </Center>

            <Center>
              <Text size="sm" c="dimmed" mt="xl">応募者の決定はこちら</Text>
            </Center>
            <Center>
              <Group>
                <Button
                  color={status.decided ? 'orange' : 'green'}
                  size="lg"
                  onClick={handleDecided}
                  loading={loadingStates.decide}
                >
                  {status.decided ? '決定を取り消す' : 'この人に決める'}
                </Button>
                {status.decided && <Text size="sm" c="dimmed">（審査中の状態に戻します）</Text>}
              </Group>
            </Center>
          </>
        )}

      </Card>
    </Container>
  );
};
