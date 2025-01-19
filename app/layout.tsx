import { Header } from "@/components/Header";
import { Geist } from "next/font/google";
import { Footer } from "@/components/Footer";
import "./globals.css";

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
        <Header />
        <main>
          <div>
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html >
  );
}
