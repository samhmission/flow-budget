import express from "express";
import cors from "cors";
import { Person } from "@flow-budget/database";

const app = express();
const port = 3000;

app.use(cors());

app.get("/budget", (req: express.Request, res: express.Response) => {
  console.log("Received request for budget data");
  res.json({ april: 1000, may: 1200, june: 800 });
});

app.get("/person", (req: express.Request, res: express.Response) => {
  console.log("Received request for person data");
  res.json({});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
