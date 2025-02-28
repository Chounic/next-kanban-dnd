"use client"

import { useTaskModal } from "@/hooks/useTaskModal"

export default function CreateTaskButton() {
  const { openModal } = useTaskModal()

  return (
    <button
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      onClick={() => openModal()}
    >
      Create Task
    </button>
  )
}

