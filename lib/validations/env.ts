import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.string().url().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  CLOUDINARY_CLOUD_NAME: z.string().min(1).optional(),
  CLOUDINARY_API_KEY: z.string().min(1).optional(),
  CLOUDINARY_API_SECRET: z.string().min(1).optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;

export function parseServerEnv(
  source: Record<string, string | undefined> = process.env,
): ServerEnv {
  return envSchema.parse(source);
}
