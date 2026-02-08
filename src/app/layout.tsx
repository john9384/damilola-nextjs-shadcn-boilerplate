import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalProvider } from "../store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ESiRS-Pay",
  description: "ESiRS-Pay admin dashboard",
  icons: {
    icon: "https://res.cloudinary.com/djnboqpze/image/upload/v1770406971/esirs_zcttct.jpg",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GlobalProvider>{children}</GlobalProvider>
      </body>
    </html>
  );
}
