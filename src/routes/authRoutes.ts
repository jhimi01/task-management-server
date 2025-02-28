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
import { addMyTasks, deleteMyTasks, getMyTask, getMyTasks, updateMyTasks } from "../controllers/tasksController";


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


router.get("/tasks", getMyTasks);
router.get("/tasks/:id", getMyTask);
router.post("/tasks", addMyTasks);
router.put("/tasks/:id", updateMyTasks);
router.delete("/tasks/:id", deleteMyTasks);

export default router;
