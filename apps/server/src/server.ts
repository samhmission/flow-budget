import express from "express";
import cors from "cors";
import { createPerson, findPeople } from "@flow-budget/database/personRepository";

const app = express();
const port = 3000;

app.use(cors());

app.get("/budget", (req: express.Request, res: express.Response) => {
  console.log("Received request for budget data");
  res.json({ april: 1000, may: 1200, june: 800 });
});

app.get("/person", (req: express.Request, res: express.Response) => {
  console.log("Received request for person data");
  createPerson({
    first_name: "John",
    last_name: "Doe",
    gender: "man",
    metadata: ""
  })
  res.json(findPeople({first_name: "John"}));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
