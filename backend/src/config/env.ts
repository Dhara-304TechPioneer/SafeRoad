import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, 'DATABASE_URL environment variable is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET environment variable is required'),
  PORT: z.preprocess(
    (val) => (val ? Number(val) : 8000),
    z.number().positive()
  ).default(8000),
  AI_SERVICE_URL: z.string().default('http://localhost:8001'),
  CORS_ORIGIN: z.string().default('http://localhost:5173,http://127.0.0.1:5173'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});


const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  const issues = parseResult.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  console.error('❌ Invalid environment variables:\n' + issues);
  throw new Error('FATAL: Environment variable validation failed:\n' + issues);
}

export const env = parseResult.data;
