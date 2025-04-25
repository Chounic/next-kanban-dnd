"use client";

import { useTaskModal } from "@/hooks/useTaskModal";
import { Task } from "@/database/kysely";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { deleteTask } from "@/action/tasks-server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";

interface TaskCardProps {
  task: Task;
  subTasks: Task[];
}

export default function TaskCard({
  task,
  ref,
  overlay = false,
  ...props
}: {
  task: TaskCardProps;
  ref?: React.Ref<HTMLDivElement>;
  overlay?: boolean;
}) {
  const { openModal } = useTaskModal();

  const dropdownMenu = useMemo(() => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => openModal(task.task, task.subTasks)}>
            <Pencil /> <span>Modifier</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={async () => deleteTask(task.task.uuid)}>
            <Trash2 /> <span>Supprimer</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }, [task.task, task.subTasks, openModal]);

  return (
    <div
      ref={ref}
      {...props}
      className="bg-white mb-4 p-4 rounded shadow cursor-pointer hover:shadow-md transition-shadow flex justify-between border-t-2 border-t-gray-200 h-[150px]"
    >
      <div>
        <h3 className="font-semibold">{task.task.name}</h3>
        <p className="text-sm text-gray-600 truncate ">
          {task.task.description}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <div className="flex-1">{!overlay && dropdownMenu}</div>
        <span
          className={cn(
            "text-xs px-2 py-1 rounded-full mt-2 inline-block",
            task.task.priority === "urgent"
              ? "bg-red-300 text-red-500 font-bold"
              : task.task.priority === "high"
              ? "bg-red-100 text-red-600"
              : task.task.priority === "medium"
              ? "bg-blue-200 text-blue-900 "
              : task.task.priority === "low"
              ? "bg-blue-100 text-blue-600 "
              : ""
          )}
        >
          {task.task.priority}
        </span>
      </div>
    </div>
  );
}
