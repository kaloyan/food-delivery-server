import { Router } from "express";
import { sample_food, sample_tags } from "../data";

const router = Router();

router.get("/", (req, res) => {
  res.send(sample_food);
});

router.get("/search/:query", (req, res) => {
  const query = req.params.query;
  const foods = sample_food.filter((food) =>
    food.name.toLowerCase().includes(query.toLowerCase())
  );

  res.send(foods);
});

router.get("/tags", (req, res) => {
  res.send(sample_tags);
});

router.get("/tag/:tag", (req, res) => {
  const tag = req.params.tag;
  const foods = sample_food.filter((food) => food?.tags.includes(tag));

  res.send(foods);
});

router.get("/:foodId", (req, res) => {
  const foodId = req.params.foodId;
  const food = sample_food.find((food) => food.id == foodId);

  res.send(food);
});

export default router;
