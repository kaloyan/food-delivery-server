import { Router } from "express";
import { OrderModel, OrderStatusStates } from "../models/order.model";
import auth from "../middlewares/auth.middleware";

const router = Router();
router.use(auth);

router.post("/create", async (req: any, res: any) => {
  const order = req.body;

  if (order.items.length < 1) {
    res.status(400).send("Cart is empty.");
    return;
  }

  // first delete old order if exist one
  await OrderModel.deleteOne({
    user: req.user.id,
    status: OrderStatusStates.NEW,
  });

  // Create new order
  const newOrder = new OrderModel({
    ...order,
    user: req.user.id,
  });

  await newOrder.save();
  res.send(newOrder);
});

router.get("/my-orders", async (req: any, res) => {
  const order = await OrderModel.findOne({
    user: req.user.id,
    status: OrderStatusStates.NEW,
  }).exec();

  if (order) {
    res.send(order);
  } else {
    res.status(400).send("Bad request.");
  }
});

export default router;
