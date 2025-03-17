import { defineConfig } from "kysely-ctl";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config({ path: `.env.local`, override: true });

export default defineConfig({
  dialect: new PostgresJSDialect({
    postgres: postgres(process.env.POSTGRES_URL!, { ssl: false }),
  }),
  migrations: {
    migrationFolder: "lib/migrations",
  },
  // seeds: {
  //   seedFolder: "lib/seeds",
  // },
});
