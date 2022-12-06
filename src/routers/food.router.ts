import { Router } from "express";
import { sample_food } from "../sample-food";
import { FoodModel } from "../models/food.model";

const router = Router();
const PAGE_SIZE = 8;

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
  let query = FoodModel.find({});
  const qc: any = query.toConstructor();

  const output = {
    items: await qc().limit(PAGE_SIZE).skip(0),
    total: await qc().count(),
    slice: { start: 1, count: PAGE_SIZE },
  };

  res.send(output);
});

router.get("/page/:num", async (req, res) => {
  const offset = Number(req.params.num) || 0;

  let query = FoodModel.find({});
  const qc: any = query.toConstructor();

  const output = {
    items: await qc()
      .limit(PAGE_SIZE)
      .skip(offset * PAGE_SIZE),
    total: await qc().count(),
    slice: { start: offset, count: PAGE_SIZE },
  };

  res.send(output);
});

router.get("/search/:query/page/:num", async (req, res) => {
  const searchPat = new RegExp(req.params.query, "i");
  const pageNum = Number(req.params.num);

  let query = FoodModel.find({ name: { $regex: searchPat } });
  const qc: any = query.toConstructor();

  const output = {
    items: await qc()
      .limit(PAGE_SIZE)
      .skip(pageNum * PAGE_SIZE),
    total: await qc().count(),
    slice: { start: pageNum, count: PAGE_SIZE },
  };

  res.send(output);
});

router.get("/search/:query", async (req, res) => {
  const searchPat = new RegExp(req.params.query, "i");

  let query = FoodModel.find({ name: { $regex: searchPat } });
  const qc: any = query.toConstructor();

  const output = {
    items: await qc().limit(PAGE_SIZE).skip(0),
    total: await qc().count(),
    slice: { start: 1, count: PAGE_SIZE },
  };

  res.send(output);
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

router.get("/tag/:tag/page/:num", async (req, res) => {
  const tag = req.params.tag;
  const offset = Number(req.params.num) || 0;

  let query = FoodModel.find({ tags: tag });
  const qc: any = query.toConstructor();

  const output = {
    items: await qc()
      .limit(PAGE_SIZE)
      .skip(offset * PAGE_SIZE),
    total: await qc().count(),
    slice: { start: offset, count: PAGE_SIZE },
  };

  res.send(output);
});

router.get("/tag/:tag", async (req, res) => {
  const tag = req.params.tag;
  let query = FoodModel.find({ tags: tag });
  const qc: any = query.toConstructor();

  const output = {
    items: await qc().limit(PAGE_SIZE).skip(0),
    total: await qc().count(),
    slice: { start: 1, count: PAGE_SIZE },
  };

  res.send(output);
});

router.get("/:foodId", async (req, res) => {
  const food = await FoodModel.findById(req.params.foodId);
  res.send(food);
});

export default router;
