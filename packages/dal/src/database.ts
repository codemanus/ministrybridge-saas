import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

// Use DATABASE_URL for Supabase Postgres connection.
// Example: postgres://user:password@db.supabase.co:6543/postgres
const connectionString = process.env.DATABASE_URL;

export const client = postgres(connectionString!, {
  prepare: true,
  idle_timeout: 20,
  max: 10,
});

export const db = drizzle(client);


