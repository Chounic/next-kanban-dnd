import ProjectLogo from "@/components/auth/AuthLogo";
import { SignOut } from "@/components/auth/SignOutButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto h-screen flex flex-col">
      <header className="flex justify-between mb-12 pt-7">
            <ProjectLogo className="flex"/>
            <SignOut />
      </header>
      {children}
    </div>
  );
}
