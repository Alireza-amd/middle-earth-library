import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const serverEnv = createEnv({
  server: {
    DB_HOST: z.string().min(1),
    DB_PASSWORD: z.string().min(1),
    DB_USER: z.string().min(1),
    DB_NAME: z.string().min(1),
    DB_PORT: z.string().min(1),
    UPSTASH_REDIS_REST_URL: z.string().min(1),
    UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
    EMAIL_NAME: z.string().min(1),
    EMAIL_PASSWORD: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    ZARINPAAL_MARCHENT_ID:z.string().min(1)
  },
  experimental__runtimeEnv: process.env,
});
