import { Paper, Text, Title, Stack, Divider, Center } from '@mantine/core';

export default function TermsPage() {
  return (
    <Paper radius="lg" p="xl" style={{ maxWidth: '800px', margin: 'auto', boxSizing: 'border-box' }}>
      <Center>
        <Title order={1} mb="xl" style={{ color: '#2C3E50' }}>
          利用規約
        </Title>
      </Center>

      <Stack gap="lg">
        <Text size="lg" style={{ lineHeight: 1.6, color: '#34495E' }}>
          この利用規約（以下「本規約」といいます）は、当アプリケーション（以下「本アプリ」といいます）を利用するにあたり、利用者（以下「ユーザー」といいます）との間で適用される条件を定めるものです。本アプリを利用することによって、ユーザーは本規約に同意したものとみなされます。
        </Text>

        <Divider />

        <Text size="lg" style={{ lineHeight: 1.6, color: '#34495E' }}>
          1. 利用目的
          <br />
          本アプリは、動物の保護および里親を探しているユーザーと、その支援を行うスタッフや団体を結びつけるために提供されています。
        </Text>

        <Text size="lg" style={{ lineHeight: 1.6, color: '#34495E' }}>
          2. 禁止事項
          <br />
          ユーザーは以下の行為を行ってはならないものとします：
        </Text>

        {/* <ul>を<p>の外に移動 */}
        <ul>
          <li>不正な情報の登録</li>
          <li>他のユーザーを不快にさせる行為</li>
          <li>本アプリのサービスを不正に利用する行為</li>
        </ul>

        <Text size="lg" style={{ lineHeight: 1.6, color: '#34495E' }}>
          3. 免責事項
          <br />
          本アプリは、提供するサービスに関連する一切の損害について、責任を負いません。利用者は自己の責任において本アプリを利用するものとします。
        </Text>

        <Text size="lg" style={{ lineHeight: 1.6, color: '#34495E' }}>
          4. 規約の変更
          <br />
          本規約は予告なく変更されることがあります。変更後の規約は、本アプリ内で公開された時点から効力を生じます。
        </Text>
      </Stack>
    </Paper>
  );
}
