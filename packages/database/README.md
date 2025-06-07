# Flow Budget Database Package

This package contains the database schema, migrations, and repositories for the Flow Budget application.

## Database Migrations

The database migrations are managed using [Kysely](https://github.com/koskimas/kysely), a type-safe SQL query builder for TypeScript.

### Migration File Structure

Migrations are stored in the `src/migrations` directory. Each migration file should be named with the following format:
`YYYYMMDD_HHMMSS_description.ts`. For example: `20250607_123456_create_budget_items_table.ts`.

Each migration file should export two functions:

- `up`: Applies the migration
- `down`: Reverts the migration

Example migration file:

```typescript
import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("budget_items")
    .addColumn("id", "uuid", (col) => col.primaryKey().notNull())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("amount", "decimal(10, 2)", (col) => col.notNull())
    .addColumn("category", "varchar")
    .addColumn("created_at", "timestamp", (col) =>
      col.notNull().defaultTo("now()")
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.notNull().defaultTo("now()")
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("budget_items").execute();
}
```

### Running Migrations

#### Development Environment

To run migrations in your development environment:

```bash
# Build the database package first
pnpm build

# Run migrations to the latest version
pnpm -F @flow-budget/database migrate:dev

# Check migration status
pnpm -F @flow-budget/database migrate:info
```

#### Test Environment

For the test environment:

```bash
pnpm -F @flow-budget/database migrate:test
```

#### Production Environment

For the production environment:

```bash
# Make sure you set the necessary environment variables first:
# DB_NAME, DB_HOST, DB_USER, DB_PASSWORD, DB_PORT
NODE_ENV=production pnpm -F @flow-budget/database migrate:prod
```

### Migration Options

The migrator CLI supports the following commands:

1. `latest` - Migrate to the latest version (default)
2. `up` - Apply the next migration
3. `down` - Revert the last migration
4. `info` - Show migration status

Usage:

```bash
# Format
node ./dist/migrator.js [command] [environment] [count]

# Examples
node ./dist/migrator.js latest development
node ./dist/migrator.js up production
node ./dist/migrator.js down test
node ./dist/migrator.js info
```

### Programmatic Usage

You can also use the migration system programmatically in your code:

```typescript
import { runMigration } from "@flow-budget/database/dist/migrator.js";

async function setupDatabase() {
  await runMigration({
    command: "latest",
    environment: "production",
  });
  console.log("Database migrations applied successfully");
}
```

## Environment Configuration

Database configuration for different environments is managed in `src/config.ts`. The following environments are supported:

- `development`: Local development database
- `test`: Test database (for running automated tests)
- `production`: Production database

For production, you can configure the database using environment variables:

- `DB_NAME`: Database name
- `DB_HOST`: Database host
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_PORT`: Database port
- `DB_POOL_SIZE`: Connection pool size
