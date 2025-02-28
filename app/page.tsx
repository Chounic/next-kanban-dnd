import { Suspense } from "react";
import TaskBoard from "@/components/TaskBoard";
import SearchBar from "@/components/SearchBar";
import CreateTaskButton from "@/components/CreateTaskButton";
import TaskModal from "@/components/TaskModal";

export default function TaskManagementPage() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <CreateTaskButton />
      </div>
      <SearchBar />
      <Suspense fallback={<div>Loading tasks...</div>}>
        <TaskBoard />
      </Suspense>
      <TaskModal />
    </main>
  );
}
