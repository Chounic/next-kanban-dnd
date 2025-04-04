import { Kysely, sql } from "kysely";

export async function up(db: Kysely<never>): Promise<void> {
  // language=Postgresql

  //TODO check data and constraints
  await db.schema
    .createTable("User")
    .ifNotExists()

    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("name", "text")
    .addColumn("email", "text", (col) => col.unique().notNull())
    .addColumn("emailVerified", "timestamptz")
    .addColumn("password", "text") // maybe add unique constraint aka 2 users can't have the same password
    .addColumn("image", "text")
    .addColumn("created_at", sql`timestamp with time zone`, (cb) =>
      cb.defaultTo(sql`current_timestamp`)
    )
    .execute();

  await db.schema
    .createTable("Account")
    .ifNotExists()

    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`)
    )
    .addColumn("userId", "uuid", (col) =>
      col.references("User.id").onDelete("cascade").notNull()
    )
    .addColumn("type", "text", (col) => col.notNull())
    .addColumn("provider", "text", (col) => col.notNull())
    .addColumn("providerAccountId", "text", (col) => col.notNull())
    .addColumn("refresh_token", "text")
    .addColumn("access_token", "text")
    .addColumn("expires_at", "bigint")
    .addColumn("token_type", "text")
    .addColumn("scope", "text")
    .addColumn("id_token", "text")
    .addColumn("session_state", "text")
    .execute();

  await db.schema
    .createIndex("Account_userId_index")
    .ifNotExists()

    .on("Account")
    .column("userId")
    .execute();

  await db.schema
    .createTable("tasks")
    .ifNotExists()
    .addColumn("id", "serial", (cb) => cb.primaryKey())
    .addColumn("uuid", "uuid", (col) =>
      col
        .defaultTo(sql`gen_random_uuid()`)
        .unique()
        .notNull()
    )
    .addColumn("name", "varchar(255)", (cb) => cb.notNull())
    .addColumn("description", "varchar(255)") //TODO change to jsonb for structured data
    .addColumn("status", "varchar(255)", (cb) =>
      cb.notNull().defaultTo(sql`'backlog'`)
    )
    .addColumn("userId", "uuid", (col) =>
      col.references("User.id").onDelete("cascade").notNull()
    )
    .addColumn("priority", "text", (cb) =>
      cb.notNull().defaultTo(sql`'medium'`)
    )
    .addColumn("dueDate", sql`timestamptz`)
    .addColumn("labels", sql`text[]`, (cb) => cb.notNull().defaultTo(sql`'{}'`))
    .addColumn("parentTaskId", "integer", (col) =>
      col.references("tasks.id").onDelete("cascade")
    )
    .addColumn("archived", "boolean", (cb) =>
      cb.notNull().defaultTo(sql`FALSE`)
    )
    .addColumn("estimatedTime", "integer")
    .addColumn("createdAt", sql`timestamp with time zone`, (cb) =>
      cb.notNull().defaultTo(sql`current_timestamp`)
    )
    .execute();
}

export async function down(db: Kysely<never>): Promise<void> {
  await db.schema.dropTable("tasks").execute();
  await db.schema.dropIndex("Account_userId_index").execute();
  await db.schema.dropTable("Account").execute();
  await db.schema.dropTable("User").execute();
}
