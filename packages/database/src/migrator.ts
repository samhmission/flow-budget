import * as path from "path";
import { promises as fs } from "fs";
import {
  Kysely,
  Migrator,
  FileMigrationProvider,
  MigrationResultSet,
} from "kysely";
import { Database } from "./types.js";
import { createDialect } from "./config.js";
import { fileURLToPath } from "url";

type MigrateOptions = {
  environment?: "development" | "test" | "production";
  command: "up" | "down" | "latest" | "info";
  migrationCount?: number;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function runMigration(
  options: MigrateOptions
): Promise<MigrationResultSet> {
  // Default to development environment if not specified
  const env =
    options.environment ||
    (process.env.NODE_ENV as "development" | "test" | "production") ||
    "development";
  const dialect = createDialect(env);

  const db = new Kysely<Database>({
    dialect,
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path.
      migrationFolder: path.join(__dirname, "migrations"),
    }),
  });

  let result: MigrationResultSet;

  try {
    // Execute the appropriate migration command
    switch (options.command) {
      case "latest":
        result = await migrator.migrateToLatest();
        break;
      case "up":
        // In Kysely, migrateUp() doesn't take any arguments directly
        // We'll implement this by getting all migrations and running just the number we want
        const upResult = await migrator.migrateUp();
        result = upResult;
        break;
      case "down":
        // In Kysely, migrateDown() doesn't take any arguments directly
        const downResult = await migrator.migrateDown();
        result = downResult;
        break;
      case "info":
        const pendingMigrations = await migrator.getMigrations();
        result = {
          results: pendingMigrations.map((m) => ({
            migrationName: m.name,
            status: m.executedAt ? "Completed" : "Pending",
          })) as any,
          error: null,
        };
        break;
      default:
        throw new Error(`Unknown command: ${options.command}`);
    }

    // Log results
    result.results?.forEach((it) => {
      if (it.status === "Success") {
        console.log(
          `migration "${it.migrationName}" was executed successfully`
        );
      } else if (it.status === "Error") {
        console.error(`failed to execute migration "${it.migrationName}"`);
      }
    });

    if (result.error) {
      console.error("failed to migrate");
      console.error("Error:", result.error);
      throw result.error;
    }
  } finally {
    // Always clean up the database connection
    await db.destroy();
  }

  return result;
}

// CLI handler function
async function main() {
  try {
    const args = process.argv.slice(2);
    const command = args[0] || "latest";
    const env = args[1] || process.env.NODE_ENV || "development";
    const count = args[2] ? parseInt(args[2]) : undefined;

    if (!["up", "down", "latest", "info"].includes(command)) {
      console.error(`Invalid command: ${command}`);
      console.error("Usage: node migrator.js [command] [environment] [count]");
      console.error("Commands: up, down, latest, info");
      console.error("Environments: development, test, production");
      process.exit(1);
    }

    await runMigration({
      command: command as "up" | "down" | "latest" | "info",
      environment: env as "development" | "test" | "production",
      migrationCount: count,
    });

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
