import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../util/jwt";

// interface IMyRequest extends Request {
//   user: string | object;
// }

declare global {
  namespace Express {
    interface Request {
      user: any;
    }
  }
}

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Pleaser login" });
  }

  const token = req.headers.authorization.split(" ")[1];
  const user = decodeToken(token);
  req.user = user;
  next();
};
