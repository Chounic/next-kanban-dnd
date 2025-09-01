"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function SignedInToast() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      // Check if this is the first load after sign-in
      const hasShown = sessionStorage.getItem("signedInToastShown");
      if (!hasShown) {
        toast(<div className="text-primary">Vous êtes connecté(e) à votre compte.</div>);
        sessionStorage.setItem("signedInToastShown", "true");
      }
    }
  }, [session]);

  return null
}