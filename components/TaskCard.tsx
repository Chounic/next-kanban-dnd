"use client";

import { useTaskModal } from "@/hooks/useTaskModal";
import { Task } from "@/database/kysely";
import { Archive, EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import { deleteTask, softDeleteTask } from "@/action/tasks-server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import React, { useMemo } from "react";

interface TaskCardProps {
  task: Task;
  subTasks: Task[];
  className?: string;
}

export default function TaskCard({
  task,
  ref,
  overlay = false,
  className,
  ...props
}: {
  task: TaskCardProps;
  ref?: React.Ref<HTMLDivElement>;
  overlay?: boolean;
  className?: string;
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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => softDeleteTask(task.task.uuid)}
          >
            <Archive /> <span>Archiver la tâche</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => deleteTask(task.task.uuid)}
            className="text-red-500"
          >
            <Trash2 /> <span>Supprimer la tâche</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }, [task.task, task.subTasks, openModal]);

  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "bg-white border shadow mb-4 p-4 rounded transition-shadow flex justify-between h-[150px]",
        className
      )}
    >
      <div>
        <h3 className="font-semibold">{task.task.name}</h3>
        <p className="text-sm text-gray-600 overflow-hidden line-clamp-3">
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
