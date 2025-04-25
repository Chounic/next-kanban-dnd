"use server";

import { CreateTask, db, TasksOrder, UpdateTask } from "@/database/kysely";
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

export async function updateTask(task: UpdateTask, revalidate: boolean = true) {
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
    .where("uuid", "=", task.uuid)
    .executeTakeFirst();
  if (revalidate) revalidatePath("/");
}

export async function deleteTask(taskUuid: string) {
  await db.deleteFrom("tasks").where("uuid", "=", taskUuid).execute();
  revalidatePath("/");
}

export async function getTasksOrder(userUuid: string) {
  const data = await db
    .selectFrom("tasks_order")
    .where("userId", "=", userUuid)
    .select("order")
    .execute();

  return data[0]?.order ?? {};
}
export async function updateTasksOrder(order: TasksOrder, userUuid: string) {
  await db
    .updateTable("tasks_order")
    .set({
      order: order,
    })
    .where("userId", "=", userUuid)
    .executeTakeFirst();
}
