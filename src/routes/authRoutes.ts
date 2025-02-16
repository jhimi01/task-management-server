import express from "express";
import { signup, verifyOTP } from "../controllers/authController";
import { login } from "../controllers/loginController";
import { verifyOTPLogin } from "../controllers/verifyOtpLogin";
import { getUserData } from "../controllers/loggedinUserController";
import { editProfileController } from "../controllers/editProfileController";
import { imageEditController } from "../controllers/imageEditController";
import { logOutController } from "../controllers/logOutController";
import { changePasswordController } from "../controllers/changePasswordController";
import { forgotPasswordController, resetPasswordController } from "../controllers/forgotPasswordController";
import { addMyTasks, deleteMyTasks, getMyTask, getMyTasks, updateMyTasks } from "../controllers/tasksController";

const router = express.Router();

router.post("/register", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/verify-otp-login", verifyOTPLogin);
router.get("/profile", getUserData);
router.put("/profile", editProfileController);
router.put("/edit-image", imageEditController);
router.delete("/logout", logOutController);
router.post("/reset-password", changePasswordController);
router.post("/sendemail-forgotpassword", forgotPasswordController);
router.post("/forgot-password/:id/:token", resetPasswordController);

router.get("/tasks", getMyTasks );
router.get("/tasks/:id", getMyTask );
router.post("/tasks", addMyTasks );
router.put("/tasks/:id", updateMyTasks );
router.delete("/tasks/:id", deleteMyTasks );



export default router;
