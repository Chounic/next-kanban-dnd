import AuthLogo from "@/components/auth/AuthLogo";
import { SignOut } from "@/components/auth/SignOutButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto">
      <AuthLogo className="hidden sm:flex fixed top-6 left-8 z-50"/>
      <header className="pt-7">
        <div className="mb-6">
          <div className="flex justify-end mb-8"><SignOut /></div>
          <h1 className="text-2xl font-bold">Task Management</h1>
        </div>
      </header>
      {children}
    </div>
  );
}
