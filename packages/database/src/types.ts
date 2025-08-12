import {
  ColumnType,
  Generated,
  Insertable,
  JSONColumnType,
  Selectable,
  Updateable,
} from "kysely";

export interface Database {
  budgetItems: BudgetItemsTable;
}

// Individual budget items (the line items)
export interface BudgetItemsTable {
  id: Generated<string>;
  name?: string;
  category: string;
  amount: number;
  description?: string;
  recurring?: boolean;
  recurrence_interval?: "weekly" | "monthly" | "yearly";
  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string | undefined>;
}

export type BudgetItem = Selectable<BudgetItemsTable>;

export type BudgetItemFilters = Partial<
  Pick<BudgetItem, "id" | "category" | "created_at">
>;

export type NewBudgetItem = Insertable<BudgetItemsTable>;
export type BudgetItemUpdate = Updateable<BudgetItemsTable>;

export type BudgetItemsDelete = {
  id: string;
};
