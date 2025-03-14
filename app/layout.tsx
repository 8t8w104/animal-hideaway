import { Header } from "@/app/components/Header";
import { Geist } from "next/font/google";
import { Footer } from "@/app/components/Footer";
import '@mantine/core/styles.css';
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "動物プラットフォーム",
  description: "動物プラットフォームです",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={geistSans.className}>
      <body>
        <MantineProvider>
          <Notifications />
          <Header />
          <main>
            <div>
              {children}
            </div>
          </main>
          <Footer />
        </MantineProvider>
      </body>
    </html >
  );
}
