"use server";

import { CreateTask, db, UpdateTask } from "@/lib/kysely";
import { revalidatePath } from "next/cache";

// Récupérer toutes les tâches
export async function getTasks() {
  return db.selectFrom("tasks").selectAll().execute();
}

export async function createTask(data: CreateTask) {
  await db
    .insertInto("tasks")
    .values({
      name: data.name,
      description: data.description,
      status: data.status as "backlog" | "ready" | "in-progress" | "done",
      userId: data.userId,
    })
    .executeTakeFirst();
  revalidatePath("/");
}

export async function updateTask(task: UpdateTask) {
  await db
    .updateTable("tasks")
    .set({
      name: task.name,
      description: task.description,
      status: task.status as "backlog" | "ready" | "in-progress" | "done",
    })
    .where("id", "=", task.id)
    .executeTakeFirst();
  revalidatePath("/");
}

export async function deleteTask(taskId: number) {
  await db.deleteFrom("tasks").where("id", "=", taskId).execute();
  revalidatePath("/");
}
