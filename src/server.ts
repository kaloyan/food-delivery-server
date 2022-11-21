import express from "express";
import cors from "cors";
import { sample_food, sample_tags, sample_users } from "./data";
import jwt from "jsonwebtoken";

const port = 3000;

const app = express();

app.use(express.json());

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);

app.get("/api/foods", (req, res) => {
  res.send(sample_food);
});

app.get("/api/foods/search/:query", (req, res) => {
  const query = req.params.query;
  const foods = sample_food.filter((food) =>
    food.name.toLowerCase().includes(query.toLowerCase())
  );

  res.send(foods);
});

app.get("/api/foods/tags", (req, res) => {
  res.send(sample_tags);
});

app.get("/api/foods/tag/:tag", (req, res) => {
  const tag = req.params.tag;
  const foods = sample_food.filter((food) => food?.tags.includes(tag));

  res.send(foods);
});

app.get("/api/foods/:foodId", (req, res) => {
  const foodId = req.params.foodId;
  const food = sample_food.find((food) => food.id == foodId);

  res.send(food);
});

app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;

  const user = sample_users.find(
    (user) => user.email == email && user.password == password
  );

  if (user) {
    const response = generateToken(user);
    res.send(response);
  } else {
    res.status(400).send("Invalid username or password.");
  }
});

const generateToken = (user: any) => {
  const token = jwt.sign(
    {
      email: user.email,
      isAdmin: user.isAdmin,
    },
    "generate-randon-server-key",
    {
      expiresIn: "14d",
    }
  );

  user.token = token;
  return user;
};

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
