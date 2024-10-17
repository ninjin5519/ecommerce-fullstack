import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (playload: object) => {
  return jwt.sign(playload, process.env.JWT_TOKEN_PASSWORD || "", {
    expiresIn: "7d",
  });
};

export const decodeToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_TOKEN_PASSWORD || "");
};
