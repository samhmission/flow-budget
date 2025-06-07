import { db } from "./database.js";
import {
  BudgetItemUpdate,
  BudgetItem,
  NewBudgetItem,
  BudgetItemFilters,
} from "./types.js";

export async function findBudgetItemById(id: string) {
  return await db
    .selectFrom("budgetItems")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function findBudgetItem(criteria: BudgetItemFilters) {
  let query = db.selectFrom("budgetItems");

  if (criteria.id) {
    query = query.where("id", "=", criteria.id); // Kysely is immutable, you must re-assign!
  }

  if (criteria.category) {
    query = query.where("category", "=", criteria.category);
  }

  if (criteria.created_at) {
    query = query.where("created_at", "=", criteria.created_at);
  }

  return await query.selectAll().execute();
}

export async function updateBudgetItem(
  id: string,
  updateWith: BudgetItemUpdate
) {
  await db
    .updateTable("budgetItems")
    .set(updateWith)
    .where("id", "=", id)
    .execute();
}

export async function createBudgetItem(budgetItem: NewBudgetItem) {
  return await db
    .insertInto("budgetItems")
    .values(budgetItem)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteBudgetItem(id: string) {
  return await db
    .deleteFrom("budgetItems")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}
