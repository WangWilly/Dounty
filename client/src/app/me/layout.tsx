"use client";

import { COOKIE_SESSION_NAME } from "@/utils/const";
import { getClientSideCookie } from "@/utils/cookies";
import { redirect } from "next/navigation";

////////////////////////////////////////////////////////////////////////////////
// https://nextjs.org/docs/app/building-your-application/authentication

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const token = getClientSideCookie(COOKIE_SESSION_NAME);
  if (token) {
    redirect("/dapp");
  }

  return <div>{children}</div>;
}
