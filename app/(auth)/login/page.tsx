'use client';

import { GitHubButton } from '@/app/components/GitHubButton';
import {
  Button,
  Divider,
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
import { login } from './actions';
import { createSupabaseClient } from "@/utils/supabase/client";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      userType: 'general',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'メールアドレスが無効です。'),
      password: (val) => (val.length < 6 ? 'パスワードは６文字以上で入力してください。' : null),
      userType: (val) => (val ? null : 'ユーザタイプは必須です。'),
    },
  });

  const loginFunc = async (formValue: typeof form.values) => {
    setLoading(true)
    await login(formValue)
    setLoading(false)
  }


  const handleLogin = async (provider: 'google' | 'github') => {
    const supabase = await createSupabaseClient();
    const redirectTo = process.env.NEXT_PUBLIC_SUPABASE_GITHUB_REDIRECT_URL!

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${redirectTo}?role=${form.values.userType}`
      },
    })
    if (error) console.error('Error logging in:', error.message);
  };

  return (
    <>
      <Center>
        <Paper radius="lg" m="sm" p="xl" miw={300} maw={600} style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', boxSizing: 'border-box' }}>
          <Text size="sm" style={{ color: "dimmed" }} >
            アカウントをお持ちでない方は
            <Text
              component="a"
              onClick={() => router.push('/sign-up')}
              style={{ cursor: 'pointer', color: 'gray', textDecoration: 'underline' }}
            >
              新規登録
            </Text>
            を押下してください
          </Text>
        </Paper>
      </Center>

      <Center>
        <Paper radius="lg" m="sm" p="xl" miw={300} maw={600} style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', boxSizing: 'border-box' }}>
          <Text size="xl" style={{ weight: "600" }} mb="sm">
            ログイン
          </Text>
          <form onSubmit={form.onSubmit(loginFunc)}>
            <Text size="sm" mt="md">
              お手持ちのアカウントでログインする
            </Text>

            <Stack m="md">
              <GitHubButton radius="xl" onClick={() => handleLogin('github')}>GitHub</GitHubButton>
            </Stack>

            <Divider label="または" labelPosition="center" my="lg" />

            <Text size="sm" mt="md" mb="md">
              メールアドレスでログインする
            </Text>

            <Stack gap={24}>
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

              <Button type="submit" radius="xl" size="lg" fullWidth loading={loading}>
                ログイン
              </Button>
            </Stack>
          </form>
        </Paper>
      </Center>
    </>
  );
}
