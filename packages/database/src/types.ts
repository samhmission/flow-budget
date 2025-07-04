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

// This interface describes the `budgetItem` table to Kysely. Table
// interfaces should only be used in the `Database` type above
// and never as a result type of a query!. See the `BudgetItem`,
// `NewBudgetItem` and `BudgetItemUpdate` types below.
export interface BudgetItemsTable {
  // Columns that are generated by the database should be marked
  // using the `Generated` type. This way they are automatically
  // made optional in inserts and updates.
  id: Generated<string>;

  category: string;
  amount: number;
  description: string;

  // You can specify a different type for each operation (select, insert and
  // update) using the `ColumnType<SelectType, InsertType, UpdateType>`
  // wrapper. Here we define a column `created_at` that is selected as
  // a `Date`, can optionally be provided as a `string` in inserts and
  // can never be updated:
  created_at: ColumnType<Date, string | undefined, never>;

  // You can specify JSON columns using the `JSONColumnType` wrapper.
  // It is a shorthand for `ColumnType<T, string, string>`, where T
  // is the type of the JSON object/array retrieved from the database,
  // and the insert and update types are always `string` since you're
  // always stringifying insert/update values.
}

// You should not use the table schema interfaces directly. Instead, you should
// use the `Selectable`, `Insertable` and `Updateable` wrappers. These wrappers
// make sure that the correct types are used in each operation.
//
// Most of the time you should trust the type inference and not use explicit
// types at all. These types can be useful when typing function arguments.
export type BudgetItem = Selectable<BudgetItemsTable>;

export type BudgetItemFilters = Partial<
  Pick<BudgetItem, "id" | "category" | "created_at">
>;

export type NewBudgetItem = Insertable<BudgetItemsTable>;
export type BudgetItemUpdate = Updateable<BudgetItemsTable>;
