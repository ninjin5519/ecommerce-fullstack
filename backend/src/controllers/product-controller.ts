import { Request, Response } from "express";
import Product from "../models/product.model";

export const allProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({}).populate("category");
    res.status(200).json({ message: "success all products", products });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "failed to get all product" });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("id", id);
  try {
    const product = await Product.findById(id).populate("category");
    console.log("first", product);
    res.status(200).json({ message: "success to get product", product });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "failed to get a product" });
  }
};
