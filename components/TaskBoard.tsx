"use client";

import { TasksOrder } from "@/database/kysely";
import CreateTaskButton from "./CreateTaskButton";
import TasksList from "./TasksList";
import { TaskWithSubTasks } from "@/app/(dashboard)/page";
import { useMemo, useState } from "react";

export default function TaskBoard({ userId, tasksWithSubTasks, tasksOrder }: { userId: string, tasksWithSubTasks: TaskWithSubTasks[], tasksOrder: TasksOrder }) {
  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-2xl font-semibold mb-12">Gestion des tâches</h1>
        <CreateTaskButton />
      </div>
      <TasksList
        tasksWithSubTasks={tasksWithSubTasks}
        order={tasksOrder}
        userId={userId}
      />
    </>
  );
}
