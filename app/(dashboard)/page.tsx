import { Suspense } from "react";
import TaskBoard from "@/components/TaskBoard";
import SearchBar from "@/components/SearchBar";
import CreateTaskButton from "@/components/CreateTaskButton";
import TaskModal from "@/components/TaskModal";
import { auth } from "@/auth";
import { User } from "@/database/kysely";

export default async function TaskManagementPage() {
  const session = await auth();
  if (!session?.user) return null;
  const user = session.user as User;
  return (
    <main className="flex flex-col container mx-auto p-4 flex-1">
      <Suspense fallback={<div>Loading tasks...</div>}>
        <TaskBoard userId={user.id} />
      </Suspense>
      <TaskModal userId={user.id} />
    </main>
  );
}
