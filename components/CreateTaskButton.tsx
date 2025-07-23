"use client";

import { useTaskModal } from "@/hooks/useTaskModal";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";

export default function CreateTaskButton() {
  const { openModal } = useTaskModal();

  return (
    <Button
      className="bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors flex space-x-2 h-[unset] p-4"
      onClick={() => openModal()}
    >
      <Plus />
      <span className="hidden sm:block">Ajouter une tâche</span>
    </Button>
  );
}
