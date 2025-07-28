import { Database } from "./types.js"; // this is the Database interface we defined earlier
import { Kysely } from "kysely";
import { createDialect } from "./config.js";
import pg from "pg";

// Default to development environment if not specified
const env = (process.env.NODE_ENV || "development") as
  | "development"
  | "test"
  | "production";
export const dialect = createDialect(env);

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
const numericTypeId = 1700; // PostgreSQL's NUMERIC/DECIMAL type ID
console.log("numericTypeId:", numericTypeId);
pg.types.setTypeParser(numericTypeId, (value: string) => {
  return parseFloat(value);
});
export const db = new Kysely<Database>({
  dialect,
});
