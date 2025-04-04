import { Suspense } from "react";
import TaskBoard from "@/components/TaskBoard";
import SearchBar from "@/components/SearchBar";
import CreateTaskButton from "@/components/CreateTaskButton";
import TaskModal from "@/components/TaskModal";
import { auth } from "@/auth";
import { User } from "@/lib/kysely";

export default async function TaskManagementPage() {
  const session = await auth();
  if (!session?.user) return null;
  const user = session.user as User;
  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <SearchBar />
        <CreateTaskButton />
      </div>
      <Suspense fallback={<div>Loading tasks...</div>}>
        <TaskBoard userId={user.id} />
      </Suspense>
      <TaskModal userId={user.id} />
    </main>
  );
}
