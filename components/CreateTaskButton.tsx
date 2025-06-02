"use client";

import { useTaskModal } from "@/hooks/useTaskModal";
import { Plus } from "lucide-react";

export default function CreateTaskButton() {
  const { openModal } = useTaskModal();

  return (
    <button
      className="bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-800/90 transition-colors flex space-x-2"
      onClick={() => openModal()}
    >
      <Plus />
      <span className="hidden sm:block">Ajouter une tâche</span>
    </button>
  );
}
