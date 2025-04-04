import AuthLayout from "@/components/auth/AuthLayout";
import GoogleAuthButton from "@/components/auth/GoogleSignInBtn";
import { LoginForm } from "@/components/auth/SignInForm";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

export default function Page() {
  return (
    <AuthLayout
      title="Se connecter"
      description="Remplissez les champs ci-dessous pour vous connecter"
    >
      <LoginForm className="mb-4" />
      <Separator />
      <GoogleAuthButton text="Se connecter avec Google" />
      <div className="mt-4 text-center text-sm">
        Vous n&apos;êtes pas encore inscrit(e)?{" "}
        <Link href="/signup" className="underline underline-offset-4">
          S&apos;inscrire
        </Link>
      </div>
    </AuthLayout>
  );
}
