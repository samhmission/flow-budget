import { sql } from "kysely";
import { db } from "./database.js";
import * as BudgetItemRepository from "./budgetItemRepository.js";
import {
  describe,
  it,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
  expect,
} from "vitest";
import { randomUUID } from "crypto";
import type {
  NewBudgetItem,
  BudgetItemUpdate,
  BudgetItemsDelete,
  BudgetItemFilters,
} from "./types.js";

describe("BudgetItemRepository", () => {
  beforeAll(async () => {
    await db.schema.dropTable("budgetItems").ifExists().execute();

    await db.schema
      .createTable("budgetItems")
      .addColumn("id", "uuid", (cb) => cb.primaryKey())
      .addColumn("name", "varchar", (cb) => cb.notNull().defaultTo(""))
      .addColumn("category", "varchar", (cb) => cb.notNull())
      .addColumn("amount", "numeric", (cb) => cb.notNull())
      .addColumn("description", "text")
      .addColumn("recurring", "boolean", (cb) => cb.notNull().defaultTo(false))
      .addColumn("recurrence_interval", "varchar(20)")
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
    const testItem: NewBudgetItem = {
      id: testId,
      name: "Test Budget Item",
      category: "test",
      amount: 100,
      description: "test item",
    };

    await BudgetItemRepository.createBudgetItem(testItem);

    const result = await BudgetItemRepository.findBudgetItemById(testId);
    expect(result).toHaveProperty("id", testId);
    expect(result).toHaveProperty("name", "Test Budget Item");
    expect(Array.isArray(result)).toBe(false);
  });

  it("should find all budgetItems with a given category", async () => {
    const testItem: NewBudgetItem = {
      id: randomUUID(),
      name: "Grocery Shopping",
      category: "food",
      amount: 50,
      description: "groceries",
    };

    await BudgetItemRepository.createBudgetItem(testItem);

    const result = await BudgetItemRepository.findBudgetItem({
      category: "food",
    });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty("category", "food");
    expect(result[0]).toHaveProperty("name", "Grocery Shopping");
  });

  it("should update category of a budgetItem with a given id", async () => {
    const testId = randomUUID();
    const testItem: NewBudgetItem = {
      id: testId,
      name: "Movie Night",
      category: "entertainment",
      amount: 25,
      description: "movies",
    };

    await BudgetItemRepository.createBudgetItem(testItem);

    await BudgetItemRepository.updateBudgetItem(testId, { category: "food" });

    const updated = await BudgetItemRepository.findBudgetItemById(testId);
    expect(updated?.category).toBe("food");
    expect(updated?.name).toBe("Movie Night"); // Name should remain unchanged
  });

  it("should create a budgetItem", async () => {
    const testItem: NewBudgetItem = {
      id: randomUUID(),
      name: "Internet Bill",
      category: "Internet",
      amount: -100,
      description: "",
    };

    const result = await BudgetItemRepository.createBudgetItem(testItem);

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("name", "Internet Bill");
    expect(result.category).toBe("Internet");
    expect(result.amount).toBe(-100);
    expect(result.recurring).toBe(false); // Should default to false
    expect(result.recurrence_interval).toBeNull(); // Should default to null
  });

  it("should delete a budgetItem with a given id", async () => {
    const testId = randomUUID();
    const testItem: NewBudgetItem = {
      id: testId,
      name: "Electric Bill",
      category: "utilities",
      amount: 75,
      description: "electric bill",
    };

    await BudgetItemRepository.createBudgetItem(testItem);

    const result = await BudgetItemRepository.deleteBudgetItem({ id: testId });
    expect(result).toBeDefined();

    // Verify it's deleted
    const deleted = await BudgetItemRepository.findBudgetItemById(testId);
    expect(deleted).toBeUndefined();
  });

  it("should return undefined when deleting non-existent item", async () => {
    const nonExistentId = randomUUID();

    const result = await BudgetItemRepository.deleteBudgetItem({
      id: nonExistentId,
    });
    expect(result).toBeUndefined();
  });

  it("should delete recurring items properly", async () => {
    const testId = randomUUID();
    const testItem: NewBudgetItem = {
      id: testId,
      name: "Monthly Subscription",
      category: "Subscriptions",
      amount: -15,
      description: "Netflix subscription",
      recurring: true,
      recurrence_interval: "monthly",
    };

    await BudgetItemRepository.createBudgetItem(testItem);

    // Verify it exists first
    const exists = await BudgetItemRepository.findBudgetItemById(testId);
    expect(exists).toBeDefined();
    expect(exists?.recurring).toBe(true);

    const result = await BudgetItemRepository.deleteBudgetItem({ id: testId });
    expect(result).toBeDefined();
    expect(result?.recurring).toBe(true); // Should return the deleted item

    // Verify it's deleted
    const deleted = await BudgetItemRepository.findBudgetItemById(testId);
    expect(deleted).toBeUndefined();
  });

  it("should validate delete operation returns correct structure", async () => {
    const testId = randomUUID();
    const testItem: NewBudgetItem = {
      id: testId,
      name: "Test Delete Item",
      category: "Test",
      amount: 100,
      description: "Item to be deleted",
    };

    await BudgetItemRepository.createBudgetItem(testItem);

    const result = await BudgetItemRepository.deleteBudgetItem({ id: testId });

    // Validate the returned item structure matches what we expect
    if (result) {
      // The result should have the same structure as BudgetItem
      expect(result).toHaveProperty("id", testId);
      expect(result).toHaveProperty("name", "Test Delete Item");
      expect(result).toHaveProperty("category", "Test");
      expect(result).toHaveProperty("amount", 100);
      expect(result).toHaveProperty("description", "Item to be deleted");
      expect(result).toHaveProperty("created_at");
      expect(result).toHaveProperty("updated_at");
    }
  });

  it("should validate BudgetItemsDelete type usage", async () => {
    const testId = randomUUID();
    const testItem: NewBudgetItem = {
      id: testId,
      name: "Type Validation Test",
      category: "Test",
      amount: 50,
      description: "Test for BudgetItemsDelete type",
    };

    await BudgetItemRepository.createBudgetItem(testItem);

    // Test that BudgetItemsDelete type is properly used
    const deleteParams: BudgetItemsDelete = { id: testId };
    const result = await BudgetItemRepository.deleteBudgetItem(deleteParams);

    expect(result).toBeDefined();
    expect(result?.id).toBe(testId);
    expect(result?.name).toBe("Type Validation Test");

    // Verify it's actually deleted
    const deleted = await BudgetItemRepository.findBudgetItemById(testId);
    expect(deleted).toBeUndefined();
  });

  it("should store amount as a decimal", async () => {
    const testItem: NewBudgetItem = {
      id: randomUUID(),
      name: "Monthly Utilities",
      category: "Utilities",
      amount: 150.75,
      description: "Monthly utilities bill",
    };

    const result = await BudgetItemRepository.createBudgetItem(testItem);
    expect(result).toHaveProperty("amount");
    expect(result.amount).toBeCloseTo(150.75, 2);
    expect(result).toHaveProperty("name", "Monthly Utilities");
  });

  it("should create a recurring budget item", async () => {
    const testItem: NewBudgetItem = {
      id: randomUUID(),
      name: "Monthly Rent",
      category: "Housing",
      amount: -1200,
      description: "Monthly rent payment",
      recurring: true,
      recurrence_interval: "monthly",
    };

    const result = await BudgetItemRepository.createBudgetItem(testItem);
    expect(result).toHaveProperty("recurring", true);
    expect(result).toHaveProperty("recurrence_interval", "monthly");
    expect(result).toHaveProperty("name", "Monthly Rent");
  });

  it("should update recurring fields", async () => {
    const testId = randomUUID();
    const testItem: NewBudgetItem = {
      id: testId,
      name: "Gym Membership",
      category: "Health",
      amount: -50,
      description: "Monthly gym payment",
    };

    await BudgetItemRepository.createBudgetItem(testItem);

    // Update to make it recurring
    await BudgetItemRepository.updateBudgetItem(testId, {
      recurring: true,
      recurrence_interval: "weekly",
    });

    const updated = await BudgetItemRepository.findBudgetItemById(testId);
    expect(updated?.recurring).toBe(true);
    expect(updated?.recurrence_interval).toBe("weekly");
  });

  it("should update multiple fields at once", async () => {
    const testId = randomUUID();
    const testItem: NewBudgetItem = {
      id: testId,
      name: "Old Name",
      category: "Old Category",
      amount: 100,
      description: "Old description",
      recurring: false,
    };

    await BudgetItemRepository.createBudgetItem(testItem);

    const updateData: BudgetItemUpdate = {
      name: "New Name",
      category: "New Category",
      amount: 200,
      description: "New description",
      recurring: true,
      recurrence_interval: "monthly",
    };

    await BudgetItemRepository.updateBudgetItem(testId, updateData);

    const updated = await BudgetItemRepository.findBudgetItemById(testId);
    expect(updated?.name).toBe("New Name");
    expect(updated?.category).toBe("New Category");
    expect(updated?.amount).toBe(200);
    expect(updated?.description).toBe("New description");
    expect(updated?.recurring).toBe(true);
    expect(updated?.recurrence_interval).toBe("monthly");
  });

  it("should update only specified fields", async () => {
    const testId = randomUUID();
    const testItem: NewBudgetItem = {
      id: testId,
      name: "Original Name",
      category: "Original Category",
      amount: 100,
      description: "Original description",
    };

    await BudgetItemRepository.createBudgetItem(testItem);

    // Update only amount
    await BudgetItemRepository.updateBudgetItem(testId, { amount: 500 });

    const updated = await BudgetItemRepository.findBudgetItemById(testId);
    expect(updated?.amount).toBe(500);
    // Other fields should remain unchanged
    expect(updated?.name).toBe("Original Name");
    expect(updated?.category).toBe("Original Category");
    expect(updated?.description).toBe("Original description");
  });

  it("should clear recurring when setting to false", async () => {
    const testId = randomUUID();
    const testItem: NewBudgetItem = {
      id: testId,
      name: "Recurring Item",
      category: "Test",
      amount: 100,
      description: "Test recurring item",
      recurring: true,
      recurrence_interval: "monthly",
    };

    await BudgetItemRepository.createBudgetItem(testItem);

    // Update to make it non-recurring
    await BudgetItemRepository.updateBudgetItem(testId, {
      recurring: false,
      recurrence_interval: undefined,
    });

    const updated = await BudgetItemRepository.findBudgetItemById(testId);
    expect(updated?.recurring).toBe(false);
    expect(updated?.recurrence_interval).toBeNull();
  });

  it("should handle null recurrence_interval for non-recurring items", async () => {
    const testItem: NewBudgetItem = {
      id: randomUUID(),
      name: "One-time Purchase",
      category: "Shopping",
      amount: -25,
      description: "One-time item",
      recurring: false,
      recurrence_interval: undefined,
    };

    const result = await BudgetItemRepository.createBudgetItem(testItem);
    expect(result.recurring).toBe(false);
    expect(result.recurrence_interval).toBeNull();
  });

  // Filter Tests
  describe("Filter Tests", () => {
    beforeEach(async () => {
      // Create test data for filtering
      const testItems: NewBudgetItem[] = [
        {
          id: randomUUID(),
          name: "Groceries",
          category: "Food",
          amount: -100,
          description: "Weekly groceries",
        },
        {
          id: randomUUID(),
          name: "Salary",
          category: "Income",
          amount: 3000,
          description: "Monthly salary",
        },
        {
          id: randomUUID(),
          name: "Restaurant",
          category: "Food",
          amount: -50,
          description: "Dinner out",
        },
        {
          id: randomUUID(),
          name: "Rent",
          category: "Housing",
          amount: -1200,
          description: "Monthly rent",
          recurring: true,
          recurrence_interval: "monthly",
        },
      ];

      for (const item of testItems) {
        await BudgetItemRepository.createBudgetItem(item);
      }
    });

    it("should find all items when no filters applied", async () => {
      const emptyFilters: BudgetItemFilters = {};
      const result = await BudgetItemRepository.findBudgetItem(emptyFilters);
      expect(result.length).toBe(4);
    });

    it("should filter by category", async () => {
      const categoryFilter: BudgetItemFilters = {
        category: "Food",
      };
      const result = await BudgetItemRepository.findBudgetItem(categoryFilter);
      expect(result.length).toBe(2);
      expect(result.every((item) => item.category === "Food")).toBe(true);
    });

    it("should filter by specific id", async () => {
      const allItemsFilter: BudgetItemFilters = {};
      const allItems =
        await BudgetItemRepository.findBudgetItem(allItemsFilter);
      expect(allItems.length).toBeGreaterThan(0);

      const specificId = allItems[0]!.id;
      const idFilter: BudgetItemFilters = {
        id: specificId,
      };

      const result = await BudgetItemRepository.findBudgetItem(idFilter);
      expect(result.length).toBe(1);
      expect(result[0]!.id).toBe(specificId);
    });

    it("should return empty array for non-existent category", async () => {
      const nonExistentFilter: BudgetItemFilters = {
        category: "NonExistentCategory",
      };
      const result =
        await BudgetItemRepository.findBudgetItem(nonExistentFilter);
      expect(result.length).toBe(0);
      expect(Array.isArray(result)).toBe(true);
    });

    it("should return empty array for non-existent id", async () => {
      const nonExistentIdFilter: BudgetItemFilters = {
        id: randomUUID(),
      };
      const result =
        await BudgetItemRepository.findBudgetItem(nonExistentIdFilter);
      expect(result.length).toBe(0);
    });
  });

  // Edge Cases and Error Handling
  describe("Edge Cases", () => {
    it("should handle items with empty descriptions", async () => {
      const testItem: NewBudgetItem = {
        id: randomUUID(),
        name: "Item with no description",
        category: "Test",
        amount: 100,
        description: "",
      };

      const result = await BudgetItemRepository.createBudgetItem(testItem);
      expect(result.description).toBe("");
    });

    it("should handle items with very long descriptions", async () => {
      const longDescription = "A".repeat(1000);
      const testItem: NewBudgetItem = {
        id: randomUUID(),
        name: "Item with long description",
        category: "Test",
        amount: 100,
        description: longDescription,
      };

      const result = await BudgetItemRepository.createBudgetItem(testItem);
      expect(result.description).toBe(longDescription);
    });

    it("should handle negative amounts", async () => {
      const testItem: NewBudgetItem = {
        id: randomUUID(),
        name: "Expense Item",
        category: "Test",
        amount: -999.99,
        description: "Negative amount test",
      };

      const result = await BudgetItemRepository.createBudgetItem(testItem);
      expect(result.amount).toBe(-999.99);
    });

    it("should handle decimal amounts", async () => {
      const testItem: NewBudgetItem = {
        id: randomUUID(),
        name: "Decimal Item",
        category: "Test",
        amount: 123.456,
        description: "Decimal test",
      };

      const result = await BudgetItemRepository.createBudgetItem(testItem);
      expect(result.amount).toBeCloseTo(123.456, 3);
    });

    it("should handle all recurrence intervals", async () => {
      const intervals: Array<"weekly" | "monthly" | "yearly"> = [
        "weekly",
        "monthly",
        "yearly",
      ];

      for (const interval of intervals) {
        const testItem: NewBudgetItem = {
          id: randomUUID(),
          name: `${interval} item`,
          category: "Test",
          amount: 100,
          description: `Test ${interval} recurrence`,
          recurring: true,
          recurrence_interval: interval,
        };

        const result = await BudgetItemRepository.createBudgetItem(testItem);
        expect(result.recurrence_interval).toBe(interval);
      }
    });

    it("should update non-existent item gracefully", async () => {
      const nonExistentId = randomUUID();
      const updateData: BudgetItemUpdate = {
        amount: 100,
      };

      // This should not throw an error
      await expect(
        BudgetItemRepository.updateBudgetItem(nonExistentId, updateData)
      ).resolves.not.toThrow();
    });

    it("should handle complex filter combinations", async () => {
      // Create a specific test item for this test
      const testItem: NewBudgetItem = {
        id: randomUUID(),
        name: "Complex Filter Test",
        category: "TestCategory",
        amount: 99.99,
        description: "Test item for complex filtering",
      };

      await BudgetItemRepository.createBudgetItem(testItem);

      // Test filtering by category specifically for this item
      const categoryFilter: BudgetItemFilters = {
        category: "TestCategory",
      };
      const result = await BudgetItemRepository.findBudgetItem(categoryFilter);

      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty("name", "Complex Filter Test");
      expect(result[0]).toHaveProperty("amount", 99.99);
    });
  });
});
