import { verify } from "jsonwebtoken";

export default (req: any, res: any, next: any) => {
  let token = req.headers.access_token as string;

  if (!token) {
    token = req.cookies.jwt_token as string;
  }

  if (!token) {
    return res.status(401).send("Unauthorized.");
  }

  try {
    const user = verify(token, process.env.JWT_SECRET_KEY!);

    req.user = user;
  } catch {
    res.status(401).send("Unauthorized.");
  }

  return next();
};
