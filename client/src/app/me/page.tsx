"use client";

import { useEffect, useState } from "react";

import { safe } from "@/utils/exception";
import { getMyAccount } from "@/clients/userClient/functions";
import { logout } from "@/utils/login";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/react";

////////////////////////////////////////////////////////////////////////////////

export default function MePage() {
  const [myEmail, setMyEmail] = useState("");

  useEffect(() => {
    const fetchMyAccount = async () => {
      const myAccountRes = await safe(getMyAccount());
      if (!myAccountRes.success) {
        console.error(myAccountRes.error);
        return;
      }

      setMyEmail(myAccountRes.data.email);
    };

    fetchMyAccount();
  }, []);

  const router = useRouter();
  const onClickLogout = async () => {
    logout();
    router.push("/me/signin");
  };

  const button = myEmail ? (
    <Button onPress={onClickLogout}>Logout</Button>
  ) : null;

  return (
    <div>
      <h1>My Account</h1>
      <div>
        <div>Email: {myEmail}</div>
      </div>
      {button}
    </div>
  );
}
