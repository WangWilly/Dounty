"use client";

////////////////////////////////////////////////////////////////////////////////
// https://nextjs.org/docs/app/building-your-application/authentication

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
