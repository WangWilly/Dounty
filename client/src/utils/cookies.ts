"use client";

import { serialize } from "cookie";

////////////////////////////////////////////////////////////////////////////////

export const getClientSideCookie = (name: string): string | undefined => {
  if (typeof document === "undefined") {
    return undefined;
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return cookieValue;
};

// https://www.geeksforgeeks.org/how-to-serialize-a-cookie-name-value-pair-into-a-set-cookie-header-string-in-javascript/
// https://stackoverflow.com/questions/75225240/accessing-cookie-client-side-with-next-js
// https://nextjs.org/docs/pages/building-your-application/authentication#stateless-sessions
export const setClientSideCookie = (
  name: string,
  value: string,
  maxAge: number,
  path: string = "/",
) => {
  if (typeof document === "undefined") {
    return undefined;
  }

  document.cookie = serialize(name, value, {
    maxAge,
    path,
  });
};
