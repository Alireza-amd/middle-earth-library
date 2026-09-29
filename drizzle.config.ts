import { defineConfig } from "drizzle-kit";
import { serverEnv } from "./data/env/server";

export default defineConfig({
  strict: true,
  verbose: true,
  out: "./drizzle/migrations",
  schema: "./drizzle/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    database: serverEnv.DB_NAME,
    user: serverEnv.DB_USER,
    password: serverEnv.DB_PASSWORD,
    host: serverEnv.DB_HOST,
    port:Number(serverEnv.DB_PORT),
    ssl: false,
  },
});
