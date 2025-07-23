import AuthLayout from "@/components/auth/AuthLayout";
import GoogleAuthButton from "@/components/auth/GoogleSignInBtn";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import ProjectLogo from "@/components/auth/AuthLogo";

export default function Page() {
  return (
    <AuthLayout
      title="S'inscrire"
      description="Remplissez les champs ci-dessous pour vous inscrire"
    >
      <ProjectLogo className="hidden sm:flex fixed top-6 right-8 z-50"/>
      <GoogleAuthButton text="S'inscrire avec Google" />
      <div className="flex items-center mb-3">
        <hr className="h-0 border-b border-solid border-grey-500 grow" />
        <p className="mx-4 text-grey-600">ou</p>
        <hr className="h-0 border-b border-solid border-grey-500 grow" />
      </div>
      <SignUpForm className="mb-4" />
      <div className="text-sm leading-relaxed text-grey-900">
        Vous êtes déjà inscrit(e) ?{" "}
        <Link
          href="/signin"
          className="font-bold text-grey-700 hover:text-primary/80"
        >
          Se connecter
        </Link>
      </div>
    </AuthLayout>
  );
}
