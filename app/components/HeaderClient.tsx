'use client'
import Link from "next/link";
import { signOutAction } from "../actions";
import { User } from "@supabase/supabase-js";
import {
  Group,
  Button,
  Avatar,
  Text,
  Box,
  Burger,
  Drawer,
  Stack
} from '@mantine/core';
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { IconPaw } from "@tabler/icons-react";
import { Role } from "@/utils/constants";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/", label: "動物を検索する" },
  { href: "/regist", label: "動物を登録する", roles: [Role.Staff] },
];

export const HeaderClient = ({ user }: { user: User | null }) => {
  const { setUserId, setRole } = useUserStore();
  const [opened, { toggle, close }] = useDisclosure(false);
  const [loading, setLoading] = useState<boolean>(false);

  const role = user?.user_metadata?.role;
  const userId = user?.id;

  const router = useRouter()
  useEffect(() => {
    if (role) {
      setRole(role);
    }
    if (userId) {
      setUserId(userId);
    }
  }, [role, setRole, userId, setUserId]);

  const handleSignOutClick = async () => {
    setLoading(true);
    try {
      await signOutAction();
    } catch (error) {
      console.error("サインアウトに失敗しました failed", error);
    } finally {
      setLoading(false);
      close()
    }
  };

  return (
    <Box
      style={{
        backgroundColor: '#f8f9fa',
        height: 60,
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Link href="/" passHref legacyBehavior>
        <Text
          component="a"
          style={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}
          size="lg"
        >
          <IconPaw size={20} style={{ marginRight: 8 }} />
          Animal Matching
        </Text>
      </Link>

      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
      <Drawer opened={opened} onClose={close} title="メニュー" size="xs" padding="md" position="right">
        <Stack>
          {navItems.map((item, index) => (
            (!item.roles || item.roles.includes(role)) && (
              <Link key={index} href={item.href} passHref legacyBehavior>
                <Text
                  component="a"
                  size="md"
                  c="blue"
                  onClick={close}
                >
                  {item.label}
                </Text>
              </Link>
            )
          ))}
          {user ? (
            <>
              <Group>
                <Avatar src={user?.user_metadata?.avatar_url} radius="xl" />
                <Text>{user.email}</Text>
              </Group>
              <Button onClick={handleSignOutClick} color="red" fullWidth loading={loading}>
                サインアウト
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => {
                close()
                router.push("/login")

              }}>ログイン</Button>
              <Button onClick={() => {
                close()
                router.push("/sign-up")

              }}>新規登録</Button>
            </>
          )}
        </Stack>
      </Drawer>

      <Group gap="md" align="center" visibleFrom="sm">
        {navItems.map((item, index) => (
          (!item.roles || item.roles.includes(role)) && (
            <Link key={index} href={item.href} passHref legacyBehavior>
              <Text component="a" c="blue" size="sm">
                {item.label}
              </Text>
            </Link>
          )
        ))}
        {user ? (
          <Button onClick={handleSignOutClick} color="red" loading={loading}>
            サインアウト
          </Button>
        ) : (
          <>
            <Link href="/login">
              <Button onClick={close}>
                ログイン
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button onClick={close}>
                新規登録
              </Button>
            </Link>
          </>
        )}
      </Group>
    </Box>
  );
}
