import express from "express";
import cors from "cors";
import {
  createBudgetItem,
  findBudgetItem,
} from "@flow-budget/database/budgetItemRepository";

const app = express();
const port = 3000;

app.use(cors());

app.get("/budget", async (req: express.Request, res: express.Response) => {
  console.log("Received request for budget data");
  res.json({ april: 1000, may: 1200, june: 800 });
});

app.get("/budgetItem", async (req: express.Request, res: express.Response) => {
  console.log("Received request for budgetItem data");
  const randomId = Math.floor(Math.random() * 1000).toString();
  console.log(`Generated random ID: ${randomId}`);
  const budgeItemId = `budgetItem-${randomId}`;
  await createBudgetItem({
    id: budgeItemId,
    category: "food",
    amount: -100,
    description: "Groceries and dining out",
  });
  const result = await findBudgetItem({ category: "food" });
  console.log(result);
  res.json(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
