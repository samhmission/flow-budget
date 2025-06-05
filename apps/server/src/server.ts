import express from "express";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());

app.get("/budget", (req: express.Request, res: express.Response) => {
    console.log("Received request for budget data");
  res.json({april: 1000, may: 1200, june: 800});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
