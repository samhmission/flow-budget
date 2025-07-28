import { sql } from "kysely";
import { db } from "./database.js";
import * as BudgetItemRepository from "./budgetItemRepository.js";
import { describe, it, beforeAll, afterAll, afterEach, expect } from "vitest";
import { randomUUID } from "crypto";

// TODO: update comments to match the new table structure
describe("BudgetItemRepository", () => {
  beforeAll(async () => {
    await db.schema.dropTable("budgetItems").ifExists().execute();

    await db.schema
      .createTable("budgetItems")
      .addColumn("id", "uuid", (cb) => cb.primaryKey())
      .addColumn("category", "varchar", (cb) => cb.notNull())
      .addColumn("amount", "numeric", (cb) => cb.notNull())
      .addColumn("description", "text")
      .addColumn("created_at", "timestamp", (cb) =>
        cb.notNull().defaultTo(sql`now()`)
      )
      .addColumn("updated_at", "timestamp", (cb) =>
        cb.notNull().defaultTo(sql`now()`)
      )
      .execute();
  });

  afterAll(async () => {
    await db.schema.dropTable("budgetItems").ifExists().execute();
  });

  afterEach(async () => {
    await sql`truncate table ${sql.table("budgetItems")}`.execute(db);
  });

  it("should find a budgetItems with a given id", async () => {
    const testId = randomUUID();
    await BudgetItemRepository.createBudgetItem({
      id: testId,
      category: "test",
      amount: 100,
      description: "test item",
    });

    const result = await BudgetItemRepository.findBudgetItemById(testId);
    expect(result).toHaveProperty("id", testId);
    expect(Array.isArray(result)).toBe(false);
  });

  it("should find all budgetItems with a given category", async () => {
    await BudgetItemRepository.createBudgetItem({
      id: randomUUID(),
      category: "food",
      amount: 50,
      description: "groceries",
    });

    const result = await BudgetItemRepository.findBudgetItem({
      category: "food",
    });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty("category", "food");
  });

  it("should update category of a budgetItem with a given id", async () => {
    const testId = randomUUID();
    await BudgetItemRepository.createBudgetItem({
      id: testId,
      category: "entertainment",
      amount: 25,
      description: "movies",
    });

    await BudgetItemRepository.updateBudgetItem(testId, { category: "food" });

    const updated = await BudgetItemRepository.findBudgetItemById(testId);
    expect(updated?.category).toBe("food");
  });

  it("should create a budgetItem", async () => {
    const result = await BudgetItemRepository.createBudgetItem({
      id: randomUUID(),
      category: "Internet",
      amount: -100,
      description: "",
    });

    expect(result).toHaveProperty("id");
    expect(result.category).toBe("Internet");
    expect(result.amount).toBe(-100);
  });

  it("should delete a budgetItem with a given id", async () => {
    const testId = randomUUID();
    await BudgetItemRepository.createBudgetItem({
      id: testId,
      category: "utilities",
      amount: 75,
      description: "electric bill",
    });

    const result = await BudgetItemRepository.deleteBudgetItem(testId);
    expect(result).toBeDefined();

    // Verify it's deleted
    const deleted = await BudgetItemRepository.findBudgetItemById(testId);
    expect(deleted).toBeUndefined();
  });

  it("should store amount as a decimal", async () => {
    const result = await BudgetItemRepository.createBudgetItem({
      id: randomUUID(),
      category: "Utilities",
      amount: 150.75,
      description: "Monthly utilities bill",
    });
    expect(result).toHaveProperty("amount");
    expect(result.amount).toBeCloseTo(150.75, 2);
  });
});

// This test suite uses Vitest to test the BudgetItemRepository functions.
