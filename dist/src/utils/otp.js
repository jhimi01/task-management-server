"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOTP = void 0;
var crypto_1 = __importDefault(require("crypto"));
var generateOTP = function () { return crypto_1.default.randomInt(100000, 999999).toString(); };
exports.generateOTP = generateOTP;
//# sourceMappingURL=otp.js.map