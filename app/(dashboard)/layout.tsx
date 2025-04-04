import { SignOut } from "@/components/auth/SignOutButton";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Task Management</h1>
          <SignOut />
        </div>
      </header>
      {children}
    </>
  );
}
