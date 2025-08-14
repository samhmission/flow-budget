import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await sql`
    ALTER TABLE "budgetItems"
    ADD COLUMN "name" VARCHAR NOT NULL DEFAULT '',
    ADD COLUMN "recurring" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "recurrence_interval" VARCHAR(20)
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
    ALTER TABLE "budgetItems"
    DROP COLUMN "name",
    DROP COLUMN "recurring",
    DROP COLUMN "recurrence_interval"
  `.execute(db);
}
