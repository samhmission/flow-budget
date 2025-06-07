import { Database } from "./types.js"; // this is the Database interface we defined earlier
import { Kysely } from "kysely";
import { createDialect } from "./config.js";

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
export const db = new Kysely<Database>({
  dialect,
});
