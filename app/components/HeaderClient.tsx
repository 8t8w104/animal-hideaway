'use client'
import Link from "next/link";
import { signOutAction } from "../actions";
import { User } from "@supabase/supabase-js";
import {
  Group,
  Button,
  Avatar,
  Text,
  useMantineTheme,
  Container,
  Center,
  Box,
} from '@mantine/core';
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import { IconPaw } from "@tabler/icons-react";

const navItems = [
  // { href: "/animals", label: "動物を検索する" },
  { href: "/regist", label: "動物を登録する" },
  // { href: "/contact", label: "運営に問い合わせる" },
];

export const HeaderClient = ({ user }: { user: User | null }) => {
  const theme = useMantineTheme();
  const { setUserId, setRole } = useUserStore();

  const role = user?.user_metadata?.role
  const userId = user?.id
  useEffect(() => {
    if (role) {
      setRole(role);
    }
    if (userId) {
      setUserId(userId);
    }
  }, [role, setRole, userId, setUserId]);


  const handleSignOutClick = () => {
    signOutAction()
  };
  return (
    <Box
      style={{
        backgroundColor: theme.colors.gray[0],
        height: 60,
        padding: theme.spacing.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Link href="/" passHref legacyBehavior>
        <Text
          component="a"
          style={{ fontWeight: 700, display: 'inline-flex', alignItems: 'center' }} // アイコンとテキストを横並びにする
          size="lg"
        >
          <IconPaw size={20} style={{ marginRight: 8 }} /> {/* アイコンを追加 */}
          Animal Matching
        </Text>
      </Link>
      <Group gap="xl" align="center">
        <nav>
          <Group gap="sm">
            {navItems.map((item, index) => (
              <Link key={index} href={item.href} passHref legacyBehavior>
                <Text component="a" color="blue" size="sm" style={{ weight: "500", textDecoration: 'none' }}>
                  {item.label}
                </Text>
              </Link>
            ))}
          </Group>
        </nav>
        {user ? (
          <Center>
            <Group gap="sm">
              <Avatar src={user?.user_metadata?.avatar_url} radius="xl" />
              <Text style={{ weight: "500" }} >{user.email}</Text>
              <Button onClick={handleSignOutClick} color="red">
                Sign out
              </Button>
            </Group>
          </Center>
        ) : (
          <Center>
            <Group>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button>Login / Sign Up</Button>
              </Link>
            </Group>
          </Center>
        )}
      </Group>
    </Box>
  );
}
