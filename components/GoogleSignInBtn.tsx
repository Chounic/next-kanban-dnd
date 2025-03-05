import { signIn } from "@/auth";
import { Button } from "./ui/button";

export default function GoogleSignIn() {
  return (
    <Button
      onClick={async () => {
        "use server";
        await signIn("google", { redirectTo: "/" });
      }}
      type="submit"
    >
      Signin with Google
    </Button>
  );
}
