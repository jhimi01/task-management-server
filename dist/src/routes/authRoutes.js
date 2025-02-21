"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var authController_1 = require("../controllers/authController");
var loginController_1 = require("../controllers/loginController");
var changePasswordController_1 = require("../controllers/changePasswordController");
var router = express_1.default.Router();
router.post("/register", authController_1.register);
router.post("/verify-otp", authController_1.verifyOTP);
router.post("/login", loginController_1.login);
router.get("/profile", loginController_1.getUserData);
router.put("/profile", loginController_1.editProfileController);
router.put("/edit-image", loginController_1.imageEditController);
router.delete("/logout", loginController_1.logOutController);
router.post("/reset-password", changePasswordController_1.changePasswordController);
router.post("/sendemail-forgotpassword", changePasswordController_1.forgotPasswordController);
router.post("/forgot-password/:id/:token", changePasswordController_1.resetPasswordController);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map