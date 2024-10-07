import { Router } from "express";
import {
  login,
  signUp,
  resetPass,
  currentUser,
  verifyPassword,
  proveOpt,
  updateUser,
} from "../controllers/auth-controller";
import { authentication } from "../middlewares/authentication";

const router = Router();
router.route("/login").post(login);
router.route("/register").post(signUp);
router.route("/current-user").get(authentication, currentUser);
router.route("/forgotpass").post(resetPass);
router.route("/verify-password").post(verifyPassword);
router.route("/verify-otp").post(proveOpt);
router.route("/user/:id").put(updateUser);

export default router;
