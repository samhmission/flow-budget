import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Create budget items table
  await db.schema
    .createTable("budgetItems")
    .addColumn("id", "varchar", (col) => col.primaryKey().notNull())
    .addColumn("category", "varchar", (col) => col.notNull())
    .addColumn("amount", "decimal(15, 2)", (col) => col.notNull())
    .addColumn("description", "varchar", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("budgetItems").execute();
}
