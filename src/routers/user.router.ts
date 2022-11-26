import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { sample_users } from "../data";
import { User, UserModel } from "../models/user.model";

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

router.post("/register", async (req, res) => {
  const { name, email, password, address } = req.body;

  // first check if user with same email already exist
  const user = await UserModel.findOne({ email }).lean();

  if (user) {
    res.status(400).send("User already exist.");
    return;
  }

  const encPass = await bcrypt.hash(password, 10);

  const newUser = new UserModel({
    id: "",
    name,
    email: email.toLowerCase(),
    password: encPass,
    address,
    isAdmin: false,
  });

  await newUser.save();

  const validUser = await UserModel.findOne({ email }).lean();

  const token = generateToken(validUser);
  const response = { ...validUser, token };

  res.send(response);
});

const generateToken = (user: any) => {
  const token = jwt.sign(
    {
      id: user.id,
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
