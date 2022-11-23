import { Router } from "express";
import jwt from "jsonwebtoken";

import { sample_users } from "../data";
import { UserModel } from "../models/user.model";

const router = Router();
let jwtKey: string = process.env.JWT_SECRET_KEY!;

router.get("/seed", async (req, res) => {
  const usersCount = await UserModel.countDocuments();

  if (usersCount > 0) {
    res.send("Seed is already done.");
    return;
  }

  await UserModel.create(sample_users);
  res.send("Seed is done.");
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email, password }).lean();

  if (user) {
    const token = await generateToken(user);
    const response = { ...user, token };
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
    jwtKey,
    {
      expiresIn: "14d",
    }
  );

  return token;
};

export default router;
