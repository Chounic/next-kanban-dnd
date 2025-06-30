import { TaskStatus } from "@/utils/registry";
import { z } from "zod";

export const authFormSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Veuillez saisir votre email",
    })
    .email("L'adresse email n'est pas valide"),
  password: z
    .string()
    .min(1, {
      message: "Veuillez saisir votre mot de passe",
    })
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
});

export type AuthFormSchema = z.infer<typeof authFormSchema>;

export const taskFormBaseSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Task name must be at least 2 characters.",
    })
    .max(50),
  description: z.string(),
  status: z.enum(Object.values(TaskStatus) as [string, ...string[]]),
  uuid: z.string().optional()
});

export type TaskFormBaseSchema = z.infer<typeof taskFormBaseSchema>;

export const taskFormSchema = taskFormBaseSchema.extend({
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.date().nullable().optional(),
  estimatedTime: z.number().int().nonnegative().nullable().optional(),
  labels: z.array(z.string()),
  archived: z.boolean(),
});

export type TaskFormSchema = z.infer<typeof taskFormSchema>;
