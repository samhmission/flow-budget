import { db } from "./database.js";
import {
  BudgetItemUpdate,
  BudgetItem,
  NewBudgetItem,
  BudgetItemFilters,
  BudgetItemsDelete,
} from "./types.js";

export async function findBudgetItemById(id: string) {
  return await db
    .selectFrom("budgetItems")
    .where("id", "=", id)
    .selectAll()
    .executeTakeFirst();
}

export async function findBudgetItem(criteria: BudgetItemFilters) {
  console.log("Finding budget item with criteria:", criteria);
  let query = db.selectFrom("budgetItems");

  if (criteria.id) {
    query = query.where("id", "=", criteria.id);
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
  // Handle undefined values properly for Kysely - convert undefined to null for nullable fields
  const updateData = { ...updateWith };
  if (
    "recurrence_interval" in updateWith &&
    updateWith.recurrence_interval === undefined
  ) {
    updateData.recurrence_interval = null;
  }

  await db
    .updateTable("budgetItems")
    .set(updateData)
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

export async function deleteBudgetItem(deleteParams: BudgetItemsDelete) {
  return await db
    .deleteFrom("budgetItems")
    .where("id", "=", deleteParams.id)
    .returningAll()
    .executeTakeFirst();
}
