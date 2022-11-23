import { Router } from "express";
import { sample_food } from "../data";
import { FoodModel } from "../models/food.model";

const router = Router();

router.get("/seed", async (req, res) => {
  const foodsCount = await FoodModel.countDocuments();

  if (foodsCount > 0) {
    res.send("Seed is already done.");
    return;
  }

  await FoodModel.create(sample_food);
  res.send("Seed is done.");
});

router.get("/", async (req, res) => {
  const foods = await FoodModel.find();
  res.send(foods);
});

router.get("/search/:query", async (req, res) => {
  const searchPat = new RegExp(req.params.query, "i");
  const foods = await FoodModel.find({ name: { $regex: searchPat } });

  res.send(foods);
});

router.get("/tags", async (req, res) => {
  const tags = await FoodModel.aggregate([
    {
      $unwind: "$tags",
    },
    {
      $group: {
        _id: "$tags",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id",
        count: "$count",
      },
    },
  ]).sort({ count: -1 });

  const all = {
    name: "All",
    count: await FoodModel.countDocuments(),
  };

  tags.unshift(all);

  res.send(tags);
});

router.get("/tag/:tag", async (req, res) => {
  const foods = await FoodModel.find({ tags: req.params.tag });
  res.send(foods);
});

router.get("/:foodId", async (req, res) => {
  const food = await FoodModel.findById(req.params.foodId);
  res.send(food);
});

export default router;
