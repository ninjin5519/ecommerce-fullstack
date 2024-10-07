import { Request, Response } from "express";
import Category from "../models/category.model";

export const allCategories = async (req: Request, res: Response) => {
  try {
    const category = await Category.find({});
    res
      .status(200)
      .json({ message: "success to get all categories", category });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "failed to get all categories" });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  const { categoryId } = req.params;
  try {
    const category = await Category.findById(categoryId).populate(categoryId);
    res.status(200).json({ message: "success to get category", category });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "failed to get all category" });
  }
};
