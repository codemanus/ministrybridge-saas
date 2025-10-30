import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';
// Database connection configuration
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/ministrybridge';
// Create the postgres client
const client = postgres(connectionString);
// Create the drizzle database instance
export const db = drizzle(client, { schema });
// Export the client for manual operations if needed
export { client };
