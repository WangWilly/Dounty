import type { Metadata } from "next";
import "./globals.css";

////////////////////////////////////////////////////////////////////////////////

export const metadata: Metadata = {
  title: "Dounty",
  description: "A simple tool to help developers find bounties.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
