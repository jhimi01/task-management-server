"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
var port = process.env.PORT || 5001;
app_1.default.listen(port, function () {
    console.log("Server running on port ".concat(port));
});
//# sourceMappingURL=server.js.map