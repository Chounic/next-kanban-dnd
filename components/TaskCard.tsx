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
  const [openArchiveDialog, setOpenArchiveDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { task: mainTask, subTasks } = task;

  const dropdownMenu = useMemo(() => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ">
          <EllipsisVertical />
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
          "bg-white border shadow mb-4 p-4 rounded transition-shadow flex justify-between h-[150px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ",
          className
        )}
      >
        <div>
          <h3 className="font-semibold overflow-hidden line-clamp-2">
            {mainTask.name}
          </h3>
          <p className="text-sm text-gray-600 overflow-hidden line-clamp-3">
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
              onClick={async () => deleteTask(mainTask.uuid)}
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
