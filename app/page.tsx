import { Suspense } from "react";
import TaskBoard from "@/components/TaskBoard";
import SearchBar from "@/components/SearchBar";
import CreateTaskButton from "@/components/CreateTaskButton";
import TaskModal from "@/components/TaskModal";
import Google from "next-auth/providers/google";
import GoogleSignIn from "@/components/GoogleSignInBtn";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { SignOut } from "@/components/SignOutButton";

export default async function TaskManagementPage() {
  const session = await auth();
  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <CreateTaskButton />
        <SignOut />
      </div>
      <SearchBar />
      <Suspense fallback={<div>Loading tasks...</div>}>
        <TaskBoard />
      </Suspense>
      <TaskModal />
    </main>
  );
}
