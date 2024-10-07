import { Router } from "express";
import { allCategories } from "../controllers/category-controller";

const router = Router();
router.route("/").get(allCategories);

export default router;
