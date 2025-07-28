import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";
import {
  createBudgetItem,
  deleteBudgetItem,
  findBudgetItem,
  findBudgetItemById,
  updateBudgetItem,
} from "@flow-budget/database/budgetItemRepository";

const app = express();
const port = 3000;

app.use(cors());

app.get("/budget", async (req: express.Request, res: express.Response) => {
  console.log("Received request for budget data");
  res.json({ april: 1000, may: 1200, june: 800 });
});

app.get("/budgetItem", async (req: express.Request, res: express.Response) => {
  console.log("Received request for all budgetItem data");

  const result = await findBudgetItem({});
  console.log("Returning budget items:", result);
  res.json(result);
});

app.get(
  "/budgetItem/:id",
  async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    console.log(`Received request for budget item with ID: ${id}`);

    if (!id) {
      res.status(400).json({ message: "ID is required" });
      return;
    }

    const result = await findBudgetItemById(id);

    if (!result) {
      res.status(404).json({ message: "Budget item not found" });
      return;
    }

    console.log(`Found budget item:`, result);
    res.json(result);
  }
);

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

app.put(
  "/budgetItem/:id",
  express.json(),
  async (req: express.Request, res: express.Response) => {
    const id = req.params.id;
    const { category, amount } = req.body;
    console.log(`Received request to update budget item with ID: ${id}`, {
      category,
      amount,
    });

    if (!id) {
      res.status(400).json({ message: "ID is required" });
      return;
    }

    try {
      await updateBudgetItem(id, { category, amount });
      res.status(200).json({
        message: "Budget item updated successfully",
        id,
        category,
        amount,
      });
    } catch (error) {
      console.error("Error updating budget item:", error);
      res
        .status(500)
        .json({ message: "Error updating budget item", error: String(error) });
    }
  }
);

app.post(
  "/budgetItem",
  express.json(),
  async (req: express.Request, res: express.Response) => {
    const { category, amount, description } = req.body;
    console.log("Received request to create budget item:", {
      category,
      amount,
      description,
    });

    if (!category || amount === undefined) {
      res.status(400).json({ message: "Category and amount are required" });
      return;
    }

    try {
      const id = randomUUID();
      const newItem = await createBudgetItem({
        id,
        category,
        amount,
        description: description || "",
      });

      res.status(201).json({
        message: "Budget item created successfully",
        item: newItem,
      });
    } catch (error) {
      console.error("Error creating budget item:", error);
      res
        .status(500)
        .json({ message: "Error creating budget item", error: String(error) });
    }
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
