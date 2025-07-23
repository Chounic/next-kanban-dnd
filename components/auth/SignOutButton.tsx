"use client";

import { Button } from "../ui/button";
import { toast } from "sonner";
import { signout } from "@/action/auth-server";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function SignOut() {
  const router = useRouter();
  const handleSignOut = async () => {
    await signout()
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
    <Button
      className="bg-gray-800 hover:bg-gray-800/90 rounded-md"
      onClick={handleSignOut}
    >
      <LogOut />
      <span className="hidden sm:inline">Déconnexion</span>
    </Button>
  );
}
