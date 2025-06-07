import { sql } from "kysely";
import { db } from "./database.js";
import * as BudgetItemRepository from "./budgetItemRepository.js";
import { describe, it, beforeAll, afterAll, afterEach, expect } from "vitest";

// TODO: update comments to match the new table structure
describe("BudgetItemRepository", () => {
  beforeAll(async () => {
    await db.schema
      .createTable("budgetItem")
      .addColumn("id", "serial", (cb) => cb.primaryKey())
      .addColumn("first_name", "varchar", (cb) => cb.notNull())
      .addColumn("last_name", "varchar")
      .addColumn("gender", "varchar(50)", (cb) => cb.notNull())
      .addColumn("metadata", "text", (cb) => cb.notNull())
      .addColumn("created_at", "timestamp", (cb) =>
        cb.notNull().defaultTo(sql`now()`)
      )
      .execute();
  });

  afterEach(async () => {
    await sql`truncate table ${sql.table("budgetItem")}`.execute(db);
  });

  it("should find a budgetItem with a given id", async () => {
    await BudgetItemRepository.findBudgetItemById("123");
  });

  it("should find all people named Arnold", async () => {
    await BudgetItemRepository.findBudgetItem({ category: "food" });
  });

  it("should update gender of a budgetItem with a given id", async () => {
    await BudgetItemRepository.updateBudgetItem("123", { category: "food" });
  });

  it("should create a budgetItem", async () => {
    const result = await BudgetItemRepository.createBudgetItem({
      category: "Internet",
      amount: -100,
      metadata: "{}",
    });
    expect(result).toHaveProperty("id");
  });

  it("should delete a budgetItem with a given id", async () => {
    await BudgetItemRepository.deleteBudgetItem("123");
  });
});
// This test suite uses Vitest to test the BudgetItemRepository functions.
