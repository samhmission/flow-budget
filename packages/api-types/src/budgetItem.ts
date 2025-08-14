export type RecurrenceInterval = "weekly" | "monthly" | "yearly";

export interface BudgetItem {
  id: string;
  name?: string; // Optional name for the item, e.g., "Groceries", "Rent"
  category: string;
  amount: number;
  description?: string;
  recurring?: boolean;
  recurrence_interval?: RecurrenceInterval | null;
  created_at: string;
  updated_at?: string;
}
