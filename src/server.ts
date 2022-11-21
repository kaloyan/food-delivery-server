import express from "express";
import cors from "cors";
import { sample_food } from "./data";

const port = 3000;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

app.get("/api/foods", (req, res) => {
  res.send(sample_food);
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
