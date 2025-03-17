"use server";

import { db, User } from "@/lib/kysely";

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await db
    .selectFrom("User")
    .where("email", "=", email)
    .selectAll()
    .executeTakeFirst();
  return user ?? null;
}
