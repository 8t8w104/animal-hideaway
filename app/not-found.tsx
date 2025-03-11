import { Center, Card, Button, Image } from "@mantine/core";

export default function NotFound() {
  return (
    <Center style={{ height: "100vh" }}>
      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Image
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhFGi_9drjBnZt6ByAK3UEBVxH_f-caYNo1eXWSrZVrFPMVVxc-fxbeCudAsEpO2MKtmAfUWkKgb43sSCrH7a07BEX3tEElli2JRi_rXvKBM4whPLe_Sl5Tp6j93XoUvBCnDhCV-ei5mXFE/s400/internet_404_page_not_found_j.png"
          alt="404 Not Found"
          fit="contain"
        />
        <Button component="a" href="/" fullWidth mt="md">
          ホームに戻る
        </Button>
      </Card>
    </Center>
  );
}
