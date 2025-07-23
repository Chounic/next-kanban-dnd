import AuthLayout from "@/components/auth/AuthLayout";
import ProjectLogo from "@/components/auth/AuthLogo";
import GoogleAuthButton from "@/components/auth/GoogleSignInBtn";
import { SignInForm } from "@/components/auth/SignInForm";
import TestComponent from "@/components/TestComponent";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";

export default function Page() {
  return (
    <AuthLayout
      title="Se connecter"
      description="Remplissez les champs ci-dessous pour vous connecter"
    >
      <ProjectLogo className="hidden sm:flex fixed top-6 right-8 z-50"/>
      <GoogleAuthButton text="Se connecter avec Google" />
      <div className="flex items-center mb-3">
        <hr className="h-0 border-b border-solid border-grey-500 grow" />
        <p className="mx-4 text-grey-600">ou</p>
        <hr className="h-0 border-b border-solid border-grey-500 grow" />
      </div>
      <SignInForm className="mb-4" />
      <div className="text-sm leading-relaxed text-grey-900">
        Vous n&apos;êtes pas encore inscrit(e)?{" "}
        <Link
          href="/signup"
          className="font-bold text-grey-700 hover:text-primary/80"
        >
          S&apos;inscrire
        </Link>
      </div>
    </AuthLayout>
    // <TestComponent />
  );
}
