import postgres from 'postgres';
import * as schema from './schema.js';
declare const client: postgres.Sql<{}>;
export declare const db: import("drizzle-orm/postgres-js").PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql<{}>;
};
export { client };
//# sourceMappingURL=database.d.ts.map