import { Kysely, sql } from "kysely";
export async function up(db: Kysely<any>): Promise<void> {
  // Alter `id` column type to UUID and set default
  await sql`
    ALTER TABLE "budgetItems"
    ALTER COLUMN "id" SET DATA TYPE uuid USING id::uuid,
    ALTER COLUMN "id" SET DEFAULT gen_random_uuid()
  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  // Reverse: change type back to varchar and remove default
  await sql`
    ALTER TABLE "budgetItems"
    ALTER COLUMN "id" SET DATA TYPE varchar,
    ALTER COLUMN "id" DROP DEFAULT
  `.execute(db);
}
