import { Request, Response } from "express";
import Cart from "../models/cart.model";

export const createCart = async (req: Request, res: Response) => {
  const { userId, productId, totalAmount, quantity } = req.body;
  try {
    const findUserCart = await Cart.findOne({ user: userId });

    if (!findUserCart) {
      const cart = await Cart.create({
        user: userId,
        products: { product: productId, quantity },
        totalAmount,
      });
      return res.status(200).json({ message: "created new cart", cart });
    }
    const findDuplicatedCart = findUserCart.products.findIndex(
      (item) => item.product.toString() === productId
    );
    if (findDuplicatedCart > -1) {
      findUserCart.products[findDuplicatedCart].quantity += quantity;
    } else {
      findUserCart.products.push({ product: productId, quantity });
    }
    const updatedCart = await findUserCart.save();
    res.status(200).json({ message: "updated cart", updatedCart });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "failed to create cart" });
  }
};

export const getCart = async (req: Request, res: Response) => {
  const { id } = req.user;
  console.log("id", id);

  try {
    const cartData = await Cart.findOne({ user: id }).populate(
      "products.product"
    );

    res.status(200).json({ message: "success to get cart", cartData });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "failed to get a cart" });
  }
};

export const updatedCart = async (req: Request, res: Response) => {
  const { id } = req.user;
  const { productId, newQuantity } = req.body;
  try {
    // 1. find user cart
    const cart = await Cart.findOne({ user: id });
    if (!cart) {
      return res.status(400).json({ message: "Not found user" });
    }
    // 2.find product
    const findProduct = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );
    cart.products[findProduct].quantity = newQuantity;
    const updatedCart = await cart.save();
    res.status(200).json({
      message: "updated cart",
      updatedCart,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "failed to get carts",
    });
  }
};
