import express, { Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth-route";
import { connectDB } from "./config/db";
import cors from "cors";
import { Resend } from "resend";
import { generateHtmlTemplate } from "./util/generateHtmlTemplate";
import productRouter from "./routes/product-route";
import categoryRouter from "./routes/category-route";
import cartRouter from "./routes/cart-route";
dotenv.config();
const PORT: string = process.env.PORT || "";

// Expressees app object uusgeh
const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);
// middlewares
app.use(cors());
app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/carts", cartRouter);

app.get("/", async (req: Request, res: Response) => {
  const randomOtp = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: ["ninjintumendelger@gmail.com"],
    subject: "hello world",
    html: generateHtmlTemplate(randomOtp),
  });
  if (error) {
    console.error("email_err", { error });
  }
  res.send("Welcome E-Commerce API server");
});

connectDB();
// Server asaah
app.listen(PORT, () => {
  console.log(`Server localhost:${PORT}`);
});
