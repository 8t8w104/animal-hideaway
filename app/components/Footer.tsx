'use client'
import { Box, Text, useMantineTheme, Group, ActionIcon, Center } from '@mantine/core';
import { IconBrandInstagram, IconBrandX } from '@tabler/icons-react'

export const Footer = () => {
  const theme = useMantineTheme();

  const currentYear = new Date().getFullYear();

  return (
    <Box
      style={{
        backgroundColor: theme.colors.gray[0], // ヘッダーと同じ背景色
        padding: theme.spacing.md,
      }}
    >
      <Center>
        <Group gap="xl"> {/* 中央揃え */}
          <Text style={{ color: "dimmed" }} size="sm">
            &copy; {currentYear} Animal Matching. All rights reserved.
          </Text>
          <Group gap="sm">
            <ActionIcon disabled>
              <IconBrandX size={18} />
            </ActionIcon>
            <ActionIcon disabled>
              <IconBrandInstagram size={18} />
            </ActionIcon>
          </Group>

        </Group>
      </Center>
    </Box>
  );
};
