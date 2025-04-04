"use server";

import { CreateTask, db, UpdateTask } from "@/lib/kysely";
import { revalidatePath } from "next/cache";

export async function createTask(data: CreateTask) {
  const task = await db
    .insertInto("tasks")
    .values({
      name: data.name,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate,
      estimatedTime: data.estimatedTime,
      userId: data.userId,
      parentTaskId: data.parentTaskId,
      labels: data.labels,
      archived: data.archived,
    })
    .returningAll()
    .executeTakeFirst();
  revalidatePath("/");

  return task;
}

export async function updateTask(task: UpdateTask) {
  await db
    .updateTable("tasks")
    .set({
      name: task.name,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      estimatedTime: task.estimatedTime,
      parentTaskId: task.parentTaskId,
      labels: task.labels,
      archived: task.archived,
    })
    .where("id", "=", task.id)
    .executeTakeFirst();
  revalidatePath("/");
}

export async function deleteTask(taskId: number) {
  await db.deleteFrom("tasks").where("id", "=", taskId).execute();
  revalidatePath("/");
}
