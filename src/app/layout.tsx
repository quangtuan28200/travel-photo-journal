import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Travel Photo Journal",
    template: "%s | Travel Photo Journal"
  },
  description: "Bộ sưu tập ảnh du lịch cá nhân theo từng chuyến đi."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
