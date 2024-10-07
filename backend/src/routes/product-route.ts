import { Router } from "express";
import { allProducts, getProduct } from "../controllers/product-controller";

const router = Router();
router.route("/").get(allProducts);
router.route("/:id").get(getProduct);

export default router;
