"use client";

import { useTaskModal } from "@/hooks/useTaskModal";
import { Task } from "@/database/kysely";
import {
  Archive,
  EllipsisVertical,
  Pencil,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { deleteTask, softDeleteTask } from "@/action/tasks-server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import React, { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface TaskCardProps {
  task: Task;
  subTasks: Task[];
  className?: string;
}
type SubTaskTuple = [string, string]; // [uuid, status]

export default function TaskCard({
  task,
  ref,
  overlay = false,
  className,
  onDelete,
  ...props
}: {
  task: TaskCardProps;
  ref?: React.Ref<HTMLDivElement>;
  overlay?: boolean;
  className?: string;
  onDelete?: (uuid: string, status: string, subTasks: SubTaskTuple[]) => Promise<void>;
}) {
  const { openModal } = useTaskModal();
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { task: mainTask, subTasks } = task;

  const dropdownMenu = useMemo(() => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ">
          <EllipsisVertical className="rotate-90 sm:rotate-0" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => openModal(mainTask, subTasks)}>
            <Pencil /> <span>Modifier</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenArchiveDialog(true)}>
            <Archive /> <span>Archiver la tâche</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDeleteDialog(true)}
            className="text-red-500 focus:text-red-500"
          >
            <Trash2 /> <span>Supprimer la tâche</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }, [mainTask, subTasks, openModal]);

  return (
    <>
      <div
        ref={ref}
        {...props}
        className={cn(
          "bg-white border shadow mb-4 p-1 sm:p-4 rounded transition-shadow sm:flex-row flex flex-col justify-between h-[120px] sm:h-[150px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring items-center sm:items-stretch overflow-hidden",
          className
        )}
      >
        <div className="overflow-hidden w-full">
          <h3 className="font-semibold overflow-hidden line-clamp-2 text-xs sm:text-base">
            {mainTask.name}
          </h3>
          <p className="text-sm text-gray-600 overflow-hidden sm:line-clamp-3 hidden">
            {mainTask.description}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex-1">{!overlay && dropdownMenu}</div>
          <span
            className={cn(
              "text-xs px-2 py-1 rounded-full mt-2 hidden xl:inline-block",
              mainTask.priority === "urgent"
                ? "bg-red-300 text-red-500 font-bold"
                : mainTask.priority === "high"
                ? "bg-red-100 text-red-600"
                : mainTask.priority === "medium"
                ? "bg-blue-200 text-blue-900 "
                : mainTask.priority === "low"
                ? "bg-blue-100 text-blue-600 "
                : ""
            )}
          >
            {mainTask.priority}
          </span>
        </div>
      </div>
      <AlertDialog open={openArchiveDialog} onOpenChange={setOpenArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous certain de vouloir archiver la tâche ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est réversible, mais vous ne pourrez plus voir cette
              tâche dans la liste des tâches actives.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-500/70 focus:bg-red-500/70"
              onClick={async (e) => softDeleteTask(mainTask.uuid)}
            >
              Archiver
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Êtes-vous certain de vouloir supprimer la tâche ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Attention ! Cette action est irréversible : la tâche sera
              supprimée de façon permanente et il ne sera pas possible de la
              récupérer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-500/70 focus:bg-red-500/70"
              onClick={() => onDelete ? onDelete(mainTask.uuid, mainTask.status, subTasks.map( st => [st.uuid, st.status])) : null}
            >
              <TriangleAlert />
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
