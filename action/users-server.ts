"use server";

import { db, User } from "@/database/kysely";

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await db
    .selectFrom("User")
    .where("email", "=", email)
    .selectAll()
    .executeTakeFirst();
  return user ?? null;
}
