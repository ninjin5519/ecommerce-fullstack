import { model, Schema } from "mongoose";

interface ICategory {
  name: string;
  description: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    description: { type: String, default: "category comment" },
  },
  { timestamps: true }
);
const Category = model<ICategory>("Category", categorySchema);
export default Category;
