import express from "express";
import cors from "cors";

import foodRouter from "./routers/food.router";
import userRouter from "./routers/user.router";

const port = 3000;

const app = express();

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

app.use("/api/foods", foodRouter);
app.use("/api/users", userRouter);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
