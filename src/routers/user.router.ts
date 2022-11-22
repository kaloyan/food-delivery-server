import { Router } from "express";
import jwt from "jsonwebtoken";

import { sample_users } from "../data";

const router = Router();

router.post("/login", (req, res) => {
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

export default router;
