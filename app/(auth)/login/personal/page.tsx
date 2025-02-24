'use client';

import { GitHubButton } from '@/app/components/GitHubButton';
import { GoogleButton } from '@/app/components/GoogleButton';
import { TwitterButton } from '@/app/components/TwitterButton';
import {
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Radio,
  PasswordInput,
  Card,
  Center,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import Link from 'next/link';

export default function Page() {
  const [isRegister, setIsRegister] = useState(false);

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      userType: 'general', // 'general' or 'staff'
      terms: true,
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
      name: (val) => (val ? null : 'Name is required'),
      userType: (val) => (val ? null : 'Please select user type'),
    },
  });

  return (
    <>
      <Center>
        <Stack mt="xl" p="md" miw={500} style={{ border: '1px solid rgba(0, 0, 0, 0.1)', boxSizing: 'border-box' }}>
          <Group >
            <Text size="sm" style={{ color: "dimmed" }} >
              {isRegister
                ? '既にアカウントをお持ちの方は'
                : 'アカウントをお持ちでない方は'}
            </Text>

            <Button onClick={() => setIsRegister(!isRegister)}>
              {isRegister ? 'ログイン' : '新規登録'}
            </Button>
            <Text size="sm">
              を押下してください
            </Text>
          </Group>
        </Stack>
      </Center>

      {isRegister &&
        <Center m="sm">
          <Stack miw={500} gap={0}>
            <Text size="sm" c="red" fw={500}>
              <Text component="span" size="xl" c="red" fw={700}>
                重要
              </Text>{' '}
              ユーザータイプとは
            </Text>
            <Text size="sm">
              一般：里親をご希望の方
            </Text>
            <Text size="sm">
              職員：新しい飼い主を探している方（動物を保護している個人・団体）
            </Text>
          </Stack>
        </Center>
      }

      <Center>
        <Paper radius="lg" m="sm" p="xl" miw={500} style={{ border: '1px solid rgba(0, 0, 0, 0.1)', boxSizing: 'border-box' }}>
          <Text size="xl" style={{ weight: "600" }} mb="sm">
            {isRegister ? '新規登録' : 'ログイン'}
          </Text>
          <form onSubmit={form.onSubmit(() => { })}>
            {isRegister &&
              <Paper
                withBorder
                shadow="xs"
                p="md"
                radius="md"
                style={{
                  border: '2px solid red',
                }}
              >
                <Radio.Group
                  required
                  label="ユーザータイプを選択してください"
                  value={form.values.userType}
                  onChange={(val) => form.setFieldValue('userType', val)}
                  error={form.errors.userType}
                  size="md"
                >
                  <Radio value="general" label="一般" />
                  <Radio value="staff" label="職員" />
                </Radio.Group>
              </Paper>
            }
            <Text size="sm" mt="md">
              {isRegister
                ? 'お手持ちのアカウントで会員登録する'
                : 'お手持ちのアカウントでログインする'}
            </Text>

            <Stack m="md">
              <GitHubButton radius="xl">GitHub</GitHubButton>
            </Stack>

            <Divider label="または" labelPosition="center" my="lg" />

            <Text size="sm" mt="md" mb="md">
              {isRegister
                ? 'メールアドレスで会員登録する'
                : 'メールアドレスでログインする'}
            </Text>

            <Stack>
              {isRegister && (
                <>
                  <TextInput
                    required
                    label="名前"
                    placeholder="名前を入力してください"
                    value={form.values.name}
                    onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                    error={form.errors.name}
                    radius="md"
                    size="md"
                  />
                </>
              )}

              {/* メールとパスワード */}
              <TextInput
                required
                label="メール"
                placeholder="メールアドレスを入力してください"
                value={form.values.email}
                onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                error={form.errors.email && 'メールアドレスが無効です'}
                radius="md"
                size="md"
              />

              <PasswordInput
                required
                label="パスワード"
                placeholder="パスワードを入力してください"
                value={form.values.password}
                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                error={form.errors.password && '６桁以上で入力してください'}
                radius="md"
                size="md"
              />

              {/* 利用規約 */}
              {isRegister && (
                <Checkbox
                  required
                  label="利用規約に同意します"
                  checked={form.values.terms}
                  onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                  size="md"
                />
              )}


              <Link href="/terms" target="_blank" rel="noopener noreferrer">
                利用規約に同意し
              </Link>
            </Stack>

            <Group mt="xl" >
              <Button type="submit" radius="xl" size="lg" fullWidth>
                {isRegister ? '新規登録' : 'ログイン'}
              </Button>
            </Group>
          </form>
        </Paper>
      </Center>
    </>
  );
}
