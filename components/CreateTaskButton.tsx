"use client";

import { useTaskModal } from "@/hooks/useTaskModal";
import { Plus } from "lucide-react";

export default function CreateTaskButton() {
  const { openModal } = useTaskModal();

  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex space-x-2"
      onClick={() => openModal()}
    >
      <Plus />
      <span>Ajouter une tâche</span>
    </button>
  );
}
