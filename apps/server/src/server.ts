import express from "express";
import cors from "cors";
import {
  deleteBudgetItem,
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
  const result = await findBudgetItem({ category: "food" });
  res.json(result);
});

app.delete(
  "/budgetItem/:id",
  async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    console.log(`Received request to delete budget item with ID: ${id}`);
    if (!id) {
      res.status(400).json({ message: "ID is required" });
      return;
    }

    const result = await deleteBudgetItem(id);
    if (result) {
      res.status(200).json({ message: "Budget item deleted successfully" });
    } else {
      res.status(404).json({ message: "Budget item not found" });
    }
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
