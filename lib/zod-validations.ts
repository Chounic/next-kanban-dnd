import { z } from "zod";

export const authFormSchema = z.object({
  email: z.string().email("L'adresse email n'est pas valide"),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
});

export type AuthFormSchema = z.infer<typeof authFormSchema>;

export const taskFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Task name must be at least 2 characters.",
    })
    .max(50),
  description: z.string(),
  status: z.enum(["backlog", "ready", "in-progress", "done"]),
});

export type TaskFormSchema = z.infer<typeof taskFormSchema>;
