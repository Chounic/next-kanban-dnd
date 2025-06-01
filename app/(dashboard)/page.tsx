import TaskBoard from "@/components/TaskBoard";
import { auth } from "@/auth";

export default async function TaskManagementPage() {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.id) return null;
  return (
    <main className="flex flex-col container mx-auto p-4 flex-1">
      <TaskBoard userId={user.id} />
    </main>
  );
}
