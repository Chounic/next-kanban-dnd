"use client";

import { Button } from "../ui/button";
import { toast } from "sonner";
import { logout } from "@/action/auth-server";
import { useRouter } from "next/navigation";

export function SignOut() {
  const router = useRouter();
  const handleSignOut = async () => {
    await logout()
      .then((data) => {
        if (data?.success) {
          toast(data?.success);
          router.push("/");
        }
        if (data?.error) {
          toast.error(data.error);
        }
      })
      .catch((data) => toast.error(data.error));
  };

  return (
    <Button className="bg-gray-800" onClick={handleSignOut}>
      Logout
    </Button>
  );
}
