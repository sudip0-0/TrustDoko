import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1).optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;

export function parseServerEnv(
  source: Record<string, string | undefined> = process.env,
): ServerEnv {
  return envSchema.parse(source);
}
