import AuthLayout from "@/components/auth/AuthLayout";
import GoogleAuthButton from "@/components/auth/GoogleSignInBtn";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

export default function Page() {
  return (
    <AuthLayout
      title="S'inscrire"
      description="Remplissez les champs ci-dessous pour vous inscrire"
    >
      <SignUpForm className="mb-4" />
      <Separator />
      <GoogleAuthButton text="S'inscrire avec Google" />
      <div className="mt-4 text-center text-sm">
        Vous êtes déjà inscrit(e) ?{" "}
        <Link
          href="/signin"
          className="underline underline-offset-4 text-primary hover:text-primary/80"
        >
          Se connecter
        </Link>
      </div>
    </AuthLayout>
  );
}
