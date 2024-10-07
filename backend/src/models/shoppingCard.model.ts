import { model, Schema } from "mongoose";

interface ICard {
  productImage: string;
  productName: string;
  productQuantity: number;
  productPrice: number;
}

const cardSchema = new Schema<ICard>(
  {
    productName: { type: String, required: true },
    productImage: { type: String, required: true },
    productQuantity: { type: Number, required: true },
    productPrice: { type: Number, required: true },
  },
  { timestamps: true }
);
const Card = model<ICard>("Category", cardSchema);
export default Card;
