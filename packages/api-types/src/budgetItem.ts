export interface BudgetItem {
  id: string; // Optional for new items
  category: string; // e.g., "Food", "Transport", "Entertainment"
  amount: number; // Positive for income, negative for expenses
  created_at: string; // ISO date string
}
