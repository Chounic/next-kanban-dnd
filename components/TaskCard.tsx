"use client";

import { useTaskModal } from "@/hooks/useTaskModal";
import { Task } from "@/lib/kysely";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { deleteTask } from "@/action/tasks-server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function TaskCard({
  task,
  subTasks,
}: {
  task: Task;
  subTasks: Task[];
}) {
  const { openModal } = useTaskModal();

  return (
    <div className="bg-white p-4 mb-2 rounded shadow cursor-pointer hover:shadow-md transition-shadow flex justify-between">
      <div>
        <h3 className="font-semibold">{task.name}</h3>
        <p className="text-sm text-gray-600 truncate">{task.description}</p>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mt-2 inline-block">
          {task.status}
        </span>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => openModal(task, subTasks)}>
              <Pencil /> <span>Modifier</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => deleteTask(task.id)}>
              <Trash2 /> <span>Supprimer</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
