import { db, sql } from "@/lib/kysely";

export async function seed() {
  await db.schema
    .createTable("tasks")
    .ifNotExists()
    .addColumn("id", "serial", (cb) => cb.primaryKey())
    .addColumn("name", "varchar(255)", (cb) => cb.notNull())
    .addColumn("description", "varchar(255)")
    .addColumn("status", "varchar(255)")
    .addColumn("createdAt", sql`timestamp with time zone`, (cb) =>
      cb.defaultTo(sql`current_timestamp`)
    )
    .execute();
}
