import { serverEnv } from "@/data/env/server";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const db = drizzle({
  schema,
  connection: {
    database: serverEnv.DB_NAME,
    user: serverEnv.DB_USER,
    password: serverEnv.DB_PASSWORD,
    host: serverEnv.DB_HOST,
  },
});
