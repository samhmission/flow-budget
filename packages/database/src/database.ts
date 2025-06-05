import { Database } from "./types.js"; // this is the Database interface we defined earlier
import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";

const dialect = new PostgresDialect({
  pool: new Pool({
    database: "flow-budget-dev",
    host: "127.0.0.1",
    user: "admin", // This is a test database, so we use a simple user.
    port: 5434,
    password: "dev", // This is a test database, so we use a simple password.
    max: 10,
  }),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
});
