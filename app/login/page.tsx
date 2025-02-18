'use client';

import { GitHubButton } from '@/app/components/GitHubButton';
import { GoogleButton } from '@/app/components/GoogleButton';
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
import { login, signup } from './actions';
import { createSupabaseClient } from "@/utils/supabase/client";

export default function Page() {
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [loading, setLoading] = useState<boolean>(false)

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      userType: 'general',
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'メールアドレスが無効です。'),
      password: (val) => (val.length < 6 ? 'パスワードは６文字以上で入力してください。' : null),
      userType: (val) => (val ? null : 'ユーザタイプは必須です。'),
    },
  });

  const registOrLogin = async (formValue: typeof form.values) => {
    setLoading(true)
    isNewAccount ? await signup(formValue) : await login(formValue)
    setLoading(false)
  }


  const handleLogin = async (provider: 'google' | 'github') => {
    const supabase = await createSupabaseClient();
    const redirectTo = process.env.NEXT_PUBLIC_SUPABASE_GITHUB_REDIRECT_URL!
    console.log(`redirectTo=${redirectTo}`);

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
            {isNewAccount
              ? '既にアカウントをお持ちの方は'
              : 'アカウントをお持ちでない方は'}
            <Text
              component="a"
              onClick={() => setIsNewAccount(!isNewAccount)}
              style={{ cursor: 'pointer', color: 'gray', textDecoration: 'underline' }}
            >
              {isNewAccount ? 'ログイン' : '新規登録'}
            </Text>
            を押下してください
          </Text>
        </Paper>
      </Center>

      <Center>
        <Paper radius="lg" m="sm" p="xl" miw={300} maw={600} style={{ width: '100%', border: '1px solid rgba(0, 0, 0, 0.1)', boxSizing: 'border-box' }}>
          <Text size="xl" style={{ weight: "600" }} mb="sm">
            {isNewAccount ? '新規登録' : 'ログイン'}
          </Text>
          <form onSubmit={form.onSubmit(registOrLogin)}>
            {isNewAccount &&
              <>
                <Stack
                  bg="#FFF0F5"
                  p="md"
                  style={{
                    border: '1px solid red',
                    borderRadius: '8px'
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
                    <Radio value="general" label="一般：里親をご希望の方" />
                    <Radio value="staff" label="職員：新しい飼い主を探している方" />
                  </Radio.Group>

                  <Text size="sm" style={{ color: '#7F8C8D' }}>
                    ※選択したユーザータイプによって、アプリ内で操作できる機能が異なります。
                    <br />
                    一般ユーザーは保護された動物の情報を閲覧し、里親として応募できます。職員ユーザーは動物の登録や里親希望者と連絡・調整を行うことができます。
                  </Text>
                </Stack>
              </>
            }

            <Text size="sm" mt="md">
              {isNewAccount
                ? 'お手持ちのアカウントで会員登録する'
                : 'お手持ちのアカウントでログインする'}
            </Text>

            <Stack m="md">
              <GitHubButton radius="xl" onClick={() => handleLogin('github')}>GitHub</GitHubButton>
              {/* <GoogleButton></GoogleButton> */}
            </Stack>

            <Divider label="または" labelPosition="center" my="lg" />

            <Text size="sm" mt="md" mb="md">
              {isNewAccount
                ? 'メールアドレスで会員登録する'
                : 'メールアドレスでログインする'}
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

              {isNewAccount && (
                <TextInput
                  label="名前"
                  placeholder="名前を入力してください"
                  value={form.values.name}
                  onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                  error={form.errors.name}
                  radius="md"
                  size="md"
                />
              )}

              {isNewAccount &&
                <Text size="sm" style={{ color: "dimmed" }} >
                  <Link href="/terms" target="_blank" rel="noopener noreferrer">
                    利用規約
                  </Link>
                  に同意した上で操作してください。
                </Text>
              }

              <Button type="submit" radius="xl" size="lg" fullWidth loading={loading}>
                {isNewAccount ? '新規登録' : 'ログイン'}
              </Button>
            </Stack>
          </form>
        </Paper>
      </Center>
    </>
  );
}
