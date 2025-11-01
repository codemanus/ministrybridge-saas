import type { Config } from 'drizzle-kit';
// Optional .env loading without requiring dotenv to be installed
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv').config({ path: '.env.local' });
} catch (_) {
  // dotenv not installed; proceed assuming env vars are already set
}

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in the environment variables")
}

export default {
  schema: ['./src/schema/*.ts'],
  out: './migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: connectionString,
  },
  strict: true,
  verbose: true,
} satisfies Config;


