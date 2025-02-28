"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordController = exports.forgotPasswordController = exports.changePasswordController = void 0;
var userModel_1 = __importDefault(require("../models/userModel"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var nodemailer_1 = __importDefault(require("nodemailer"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// change password
var changePasswordController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, _a, email, oldPassword, newPassword, decoded, userId, user, isOldPasswordValid, hashedNewPassword, newToken, err_1;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ error: "Authorization token is required" })];
                }
                _a = req.body, email = _a.email, oldPassword = _a.oldPassword, newPassword = _a.newPassword;
                if (!oldPassword) {
                    return [2 /*return*/, res.status(401).json({ error: "you can't change password" })];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 7, , 8]);
                decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
                userId = decoded.userId;
                return [4 /*yield*/, userModel_1.default.user.findUnique({ where: { email: email } })];
            case 2:
                user = _c.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).send("User not found")];
                }
                if (!user || !user.password) {
                    return [2 /*return*/, res.status(400).json({ error: "User or password is missing." })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(oldPassword, user.password)];
            case 3:
                isOldPasswordValid = _c.sent();
                if (!isOldPasswordValid) {
                    return [2 /*return*/, res.status(400).send("Incorrect old password")];
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(newPassword, 10)];
            case 4:
                hashedNewPassword = _c.sent();
                return [4 /*yield*/, userModel_1.default.user.update({
                        where: { email: email },
                        data: { password: hashedNewPassword },
                    })];
            case 5:
                _c.sent();
                newToken = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
                return [4 /*yield*/, userModel_1.default.loggedInUser.upsert({
                        where: { userId: user.id },
                        update: {
                            token: newToken,
                        },
                        create: {
                            userId: user.id,
                            token: newToken,
                            verifiedOtp: true,
                        },
                    })];
            case 6:
                _c.sent();
                return [2 /*return*/, res.status(200).json({
                        message: "Password updated successfully",
                        token: newToken,
                        userData: user,
                    })];
            case 7:
                err_1 = _c.sent();
                console.error("Error during password reset:", err_1);
                return [2 /*return*/, res.status(500).send("Error during password reset")];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.changePasswordController = changePasswordController;
// send mail
var forgotPasswordController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, token, transporter, mailOptions, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                if (!email) {
                    return [2 /*return*/, res.status(400).json({ error: "Email is required" })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, userModel_1.default.user.findUnique({ where: { email: email } })];
            case 2:
                user = _a.sent();
                if (!user) {
                    return [2 /*return*/, res.status(400).json({ error: "User does not exist" })];
                }
                if (user && !user.password) {
                    return [2 /*return*/, res.status(400).json({
                            error: "Try logging in with your Gmail account using the same email address",
                        })];
                }
                token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
                transporter = nodemailer_1.default.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS,
                    },
                });
                mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: "Reset your password",
                    text: "https://task-management-server-pmpg.vercel.app/auth/forgot-password/".concat(user.id, "/").concat(token),
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.error("Error sending email:", error);
                        return res.status(500).send("Error during password reset");
                    }
                    else {
                        console.log("Email sent: " + info.response);
                        return res.status(200).json({ message: "Email sent" });
                    }
                });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("Error during email sending:", error_1);
                return [2 /*return*/, res.status(500).send("Internal server error")];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.forgotPasswordController = forgotPasswordController;
// reset password
var resetPasswordController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, id, token, newPassword, decoded, hashedPassword, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.params, id = _a.id, token = _a.token;
                newPassword = req.body.newPassword;
                if (!newPassword) {
                    return [2 /*return*/, res.status(400).json({ error: "New password is required" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
                if (decoded.userId !== id) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid or expired token" })];
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(newPassword, 10)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, userModel_1.default.user.update({
                        where: { id: id },
                        data: { password: hashedPassword },
                    })];
            case 3:
                _b.sent();
                res.status(200).json({ message: "Password reset successfully" });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error("Error in reset password:", error_2);
                res.status(500).json({ error: "Internal server error" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.resetPasswordController = resetPasswordController;
//# sourceMappingURL=changePasswordController.js.map