import { Request, Response } from "express";
import User from "../models/user.model";
import { Resend } from "resend";
import { generateHtmlTemplate } from "../util/generateHtmlTemplate";
import bcrypt from "bcrypt";
import { generateToken } from "../util/jwt";
import crypto from "crypto";
import { sendEmail } from "../util/send-email";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Cannot be empty" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Not found a user" });
    } else {
      const isCheck = bcrypt.compareSync(password, user.password.toString());
      if (!isCheck) {
        return res
          .status(400)
          .json({ message: "User's email or password is wrong" });
      } else {
        const token = generateToken({ id: user._id });
        res.status(200).json({ message: "success", token });
      }
    }
  } catch (error) {
    res.status(400).json({ message: "Client error" });
  }
};

export const signUp = async (req: Request, res: Response) => {
  try {
    const { lastname, firstname, email, password } = req.body;
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ message: "Хоосон утга байж болохгүй." });
    }

    console.log(firstname);
    const createdUser = await User.create({
      firstname,
      lastname,
      email,
      password,
      phoneNumber: "",
    });

    res.status(201).json({ message: "success", user: createdUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error: error });
  }
};

export const currentUser = async (req: Request, res: Response) => {
  const { id } = req.body;
  const findUser = await User.findById(id);
  res.status(200).json({ user: findUser, message: "Success" });
};

export const resetPass = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    console.log("email", email);
    if (!email) {
      return res.status(404).json({ message: "Not found email" });
    } else {
      const randomOtp = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");

      const userMatch = await User.findOne({ email: email });
      if (!userMatch) {
        return res.status(404).json({ message: "Not found user" });
      }

      userMatch.otp = randomOtp;
      await userMatch.save();
      await sendEmail(email, randomOtp);
      res.status(200).json({ message: "OTP code is sent email successfully" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Client error" });
  }
};
export const proveOpt = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const findUser = await User.findOne({ email, otp });
  if (!findUser) {
    return res.status(404).json({ message: "Not match otp" });
  }

  const resetToken = crypto.randomBytes(25).toString("hex");
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  findUser.passwordResetToken = hashedResetToken;
  findUser.passwordResetTokenExpire = new Date(Date.now() + 10 * 60 * 1000);
  await findUser.save();
  console.log("RT", resetToken);
  await sendEmail(
    email,
    `<a href="http://localhost:3000/new-pass?resettoken=${resetToken}">Нууц үг сэргээх холбоос</a>`
  );
  res.status(200).json({ message: "Send create new password email" });
};

export const verifyPassword = async (req: Request, res: Response) => {
  const { password, resetToken } = req.body;
  const hashedResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const findUser = await User.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetTokenExpire: { $gt: Date.now },
  });
  if (!findUser) {
    return res
      .status(400)
      .json({ message: "Your reset-password time is over" });
  }
  findUser.password = password;
  await findUser.save();
  res.status(200).json({ message: "Reset password successfully" });
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateUser = await User.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({ message: "User info is updated", updateUser });
};
