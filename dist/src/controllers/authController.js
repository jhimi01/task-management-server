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
exports.verifyOTP = exports.register = void 0;
var userModel_1 = __importDefault(require("../models/userModel"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var email_1 = require("../utils/email");
var otp_1 = require("../utils/otp");
// Register Function
var register = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name, email, userName, password, existingUser, hashedPassword, otp, otpExpiration, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, name = _a.name, email = _a.email, userName = _a.userName, password = _a.password;
                return [4 /*yield*/, userModel_1.default.user.findUnique({ where: { email: email } })];
            case 1:
                existingUser = _b.sent();
                if (existingUser === null || existingUser === void 0 ? void 0 : existingUser.isVerified) {
                    return [2 /*return*/, res.status(400).send("Email is already registered.")];
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                otp = (0, otp_1.generateOTP)();
                otpExpiration = new Date(Date.now() + 10 * 60 * 1000);
                return [4 /*yield*/, userModel_1.default.user.upsert({
                        where: { email: email },
                        update: { otp: otp, otpExpiration: otpExpiration },
                        create: {
                            email: email,
                            name: name,
                            userName: userName,
                            password: hashedPassword,
                            otp: otp,
                            otpExpiration: otpExpiration,
                            isVerified: false,
                        },
                    })];
            case 3:
                _b.sent();
                // Send OTP via email
                return [4 /*yield*/, (0, email_1.sendOTPEmail)(email, otp)];
            case 4:
                // Send OTP via email
                _b.sent();
                res.status(200).json({ message: "OTP sent to email." });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                console.error(error_1);
                res.status(500).send("Internal Server Error");
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.register = register;
// verifyOTP action
var verifyOTP = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, otp, name, userName, password, user, hashedPassword, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                _a = req.body, email = _a.email, otp = _a.otp, name = _a.name, userName = _a.userName, password = _a.password;
                return [4 /*yield*/, userModel_1.default.user.findUnique({ where: { email: email } })];
            case 1:
                user = _b.sent();
                if (!user) {
                    return [2 /*return*/, res.status(404).send("User not found.")];
                }
                if (!user.otpExpiration ||
                    user.otp !== otp ||
                    user.otpExpiration < new Date()) {
                    return [2 /*return*/, res.status(400).send("Invalid or expired OTP.")];
                }
                return [4 /*yield*/, bcryptjs_1.default.hash(password, 10)];
            case 2:
                hashedPassword = _b.sent();
                return [4 /*yield*/, userModel_1.default.user.update({
                        where: { email: email },
                        data: {
                            password: hashedPassword,
                            name: name,
                            userName: userName,
                            isVerified: true,
                            otp: null,
                            otpExpiration: null,
                        },
                    })];
            case 3:
                _b.sent();
                res.status(200).send("OTP verified. Account activated.");
                return [3 /*break*/, 5];
            case 4:
                error_2 = _b.sent();
                console.error(error_2);
                res.status(500).send("Internal Server Error");
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.verifyOTP = verifyOTP;
//# sourceMappingURL=authController.js.map