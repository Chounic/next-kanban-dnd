import { signOut } from "@/auth";
import { Button } from "./ui/button";

export function SignOut() {
  return (
    <Button
      onClick={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      {" "}
      Se déconnecter{" "}
    </Button>
  );
}
