import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import foodRouter from "./routers/food.router";
import userRouter from "./routers/user.router";
import { dbConnect } from "./config/database";

dbConnect();

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

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server listening on http://localhost:${process.env.SERVER_PORT}`
  );
});
