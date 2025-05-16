"use server";

import { CreateTask, db, TasksOrder, UpdateTask } from "@/database/kysely";
import { revalidatePath } from "next/cache";
import { OpenAI } from "openai";

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

export async function softDeleteTask(taskUuid: string) {
  await db
    .updateTable("tasks")
    .set({
      archived: true,
    })
    .where("uuid", "=", taskUuid)
    .executeTakeFirst();
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
export async function updateTasksOrder(
  order: TasksOrder,
  userUuid: string,
  revalidate: boolean = true
) {
  await db
    .updateTable("tasks_order")
    .set({
      order: order,
    })
    .where("userId", "=", userUuid)
    .executeTakeFirst();

  if (revalidate) revalidatePath("/");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type TaskSuggestion = {
  tags: string[];
  priority: "low" | "medium" | "high" | "urgent" | null;
  estimatedTime: number | null;
  dueDate: Date | null;
  subtasks: string[];
};

export async function suggestTaskMetadata(
  title: string,
  description: string
): Promise<TaskSuggestion | null> {
  const currentDate = new Date().toISOString().split("T")[0];
  const prompt = `Nous sommes le ${currentDate}. Tu es un assistant intelligent qui aide à organiser des tâches dans une application de gestion de projet du style Jira ou GitHub.
  
  Pour chaque tâche, tu dois proposer un JSON strictement valide avec :
  - "tags": jusqu'à 5 mots-clés pertinents. Tableau de strings. Si aucun pertinent, renvoie un tableau vide.
  - "priority": renvoie une des valeurs "low" | "medium" | "high" | "urgent". Mais si aucun pertinent, renvoie la valeur null.
  - "estimatedTime": temps estimé en nombre de jours. Optionnel.
  - "dueDate": échéance absolue (ex: "2025-05-12"). Optionnel. Si aucune échéance n'est mentionnée, renvoie la valeur null.
  - "subtasks": jusqu'à 5 sous-tâches. Optionnel. Tableau de strings.
  
  Réponds uniquement avec un JSON strictement conforme.
  
  Voici la tâche :
  Titre : ${title}
  Description : ${description}`;

  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "Tu es un assistant d’organisation de tâches. Réponds uniquement en JSON.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
  });

  try {
    const content = res.choices[0].message.content;
    if (!content) return null;
    return JSON.parse(content) as TaskSuggestion;
  } catch (err) {
    console.error("Erreur de parsing JSON:", err);
    return null;
  }
}
