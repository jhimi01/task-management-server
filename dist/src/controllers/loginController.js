"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.logOutController = exports.imageEditController = exports.editProfileController = exports.getUserData = exports.login = void 0;
var axios_1 = __importDefault(require("axios"));
var userModel_1 = __importDefault(require("../models/userModel"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// login action
var login = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, recaptchaToken, response, user, match, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password, recaptchaToken = _a.recaptchaToken;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 6, , 7]);
                return [4 /*yield*/, axios_1.default.post("https://www.google.com/recaptcha/api/siteverify", null, {
                        params: {
                            secret: process.env.RECAPTCHA_SECRET_KEY,
                            response: recaptchaToken,
                        },
                    })];
            case 2:
                response = _b.sent();
                if (!response.data.success) {
                    return [2 /*return*/, res.status(400).json({ error: "reCAPTCHA verification failed" })];
                }
                return [4 /*yield*/, userModel_1.default.user.findUnique({ where: { email: email } })];
            case 3:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res
                            .status(401)
                            .json({ error: "Invalid email, register with a valid email" })];
                }
                if (!user || !user.password) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid credentials" })];
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 4:
                match = _b.sent();
                if (!match) {
                    return [2 /*return*/, res.status(401).json({ error: "Invalid password" })];
                }
                token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
                return [4 /*yield*/, userModel_1.default.loggedInUser.upsert({
                        where: { userId: user.id },
                        update: {
                            verifiedOtp: true,
                            token: token,
                        },
                        create: {
                            userId: user.id,
                            verifiedOtp: true,
                            token: token,
                        },
                    })];
            case 5:
                _b.sent();
                res.status(200).json({
                    message: "User verified successfully",
                    userData: __assign({}, user),
                    token: token,
                });
                return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                console.error("Error during login:", error_1);
                return [2 /*return*/, res.status(500).send("Error during login")];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
// loggedIn user data
var getUserData = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded, user, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ error: "Authorization token is required" })];
                }
                decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
                return [4 /*yield*/, userModel_1.default.user.findUnique({
                        where: { id: decoded.userId },
                        include: {
                            LoggedInUser: true,
                        },
                    })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).json({ error: "User not found" })];
                }
                return [2 /*return*/, res.status(200).json({
                        message: "User data retrieved successfully",
                        userData: __assign({}, user),
                        loggedInUser: user.LoggedInUser,
                    })];
            case 2:
                error_2 = _b.sent();
                console.error("Error during token verification:", error_2);
                return [2 /*return*/, res.status(401).json({ error: "Invalid or expired token" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserData = getUserData;
// update user information
var editProfileController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded, userId, _a, name, userName, email, bio, existingUser, updateData, updatedUser, error_3;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ error: "Authorization token is required" })];
                }
                _c.label = 1;
            case 1:
                _c.trys.push([1, 5, , 6]);
                decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
                userId = decoded.userId;
                _a = req.body, name = _a.name, userName = _a.userName, email = _a.email, bio = _a.bio;
                if (!email) return [3 /*break*/, 3];
                return [4 /*yield*/, userModel_1.default.user.findUnique({
                        where: { email: email },
                    })];
            case 2:
                existingUser = _c.sent();
                if (existingUser && existingUser.id !== userId) {
                    return [2 /*return*/, res.status(400).json({ error: "Email is already in use" })];
                }
                _c.label = 3;
            case 3:
                updateData = {};
                if (name)
                    updateData.name = name;
                if (userName)
                    updateData.userName = userName;
                if (email)
                    updateData.email = email;
                if (bio) {
                    updateData.bio = bio;
                }
                else {
                    updateData.bio = "";
                }
                return [4 /*yield*/, userModel_1.default.user.update({
                        where: { id: userId },
                        data: updateData,
                    })];
            case 4:
                updatedUser = _c.sent();
                return [2 /*return*/, res.status(200).json({
                        message: "User profile updated successfully",
                        userData: updatedUser,
                    })];
            case 5:
                error_3 = _c.sent();
                console.error("Error updating user profile:", error_3);
                return [2 /*return*/, res.status(500).json({ error: "Internal server error" })];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.editProfileController = editProfileController;
// image add
var imageEditController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded, userId, img, updatedUser, error_4;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ error: "Authorization token is required" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
                userId = decoded.userId;
                img = req.body.img;
                if (!img) {
                    return [2 /*return*/, res.status(400).json({ error: "Image URL is required" })];
                }
                return [4 /*yield*/, userModel_1.default.user.update({
                        where: { id: userId },
                        data: { img: img },
                    })];
            case 2:
                updatedUser = _b.sent();
                return [2 /*return*/, res.status(200).json({
                        message: "User profile updated successfully",
                        userData: updatedUser,
                    })];
            case 3:
                error_4 = _b.sent();
                console.error("Error updating user profile:", error_4);
                return [2 /*return*/, res.status(500).json({ error: "Internal server error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.imageEditController = imageEditController;
// logout
var logOutController = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded, userId, error_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ error: "Authorization token is required" })];
                }
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
                userId = decoded.userId;
                if (!userId) {
                    return [2 /*return*/, res.status(400).json({ error: "Invalid token payload" })];
                }
                // Delete LoggedInUser record
                return [4 /*yield*/, userModel_1.default.loggedInUser.delete({
                        where: { userId: userId },
                    })];
            case 2:
                // Delete LoggedInUser record
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: "Logged out successfully" })];
            case 3:
                error_5 = _b.sent();
                console.error("Error during logout:", error_5);
                return [2 /*return*/, res.status(500).json({ error: "Failed to logout" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.logOutController = logOutController;
//# sourceMappingURL=loginController.js.map