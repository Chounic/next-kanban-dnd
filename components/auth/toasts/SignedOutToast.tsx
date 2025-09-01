"use client";

import { useEffect} from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function SignedOutToast() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      const hasShown = sessionStorage.getItem("signedInToastShown");
      if (hasShown) {
        sessionStorage.removeItem("signedInToastShown");
        toast("Vous êtes déconnecté(e).");
      }
    }
  }, [session]);

  return null
}