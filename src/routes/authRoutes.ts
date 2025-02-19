import express from "express";
import { register, verifyOTP } from "../controllers/authController";
import {
  editProfileController,
  getUserData,
  imageEditController,
  login,
  logOutController,
} from "../controllers/loginController";
import { changePasswordController, forgotPasswordController, resetPasswordController } from "../controllers/changePasswordController";


const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/profile", getUserData);
router.put("/profile", editProfileController);
router.put("/edit-image", imageEditController);
router.delete("/logout", logOutController);
router.post("/reset-password", changePasswordController);
router.post("/sendemail-forgotpassword", forgotPasswordController);
router.post("/forgot-password/:id/:token", resetPasswordController);

export default router;
