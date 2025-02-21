"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var authRoutes_1 = __importDefault(require("./src/routes/authRoutes"));
var tasksRoutes_1 = __importDefault(require("./src/routes/tasksRoutes"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Routes
app.use("/auth", authRoutes_1.default);
app.use("/auth", tasksRoutes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map