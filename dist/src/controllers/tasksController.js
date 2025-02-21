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
exports.deleteMyTasks = exports.updateMyTasks = exports.addMyTasks = exports.getMyTask = exports.getMyTasks = void 0;
var userModel_1 = __importDefault(require("../models/userModel"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// get all tasks
var getMyTasks = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded, myTasks, err_1;
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
                return [4 /*yield*/, userModel_1.default.task.findMany({
                        where: { userId: decoded.userId }, // Filter tasks by the user's ID
                    })];
            case 1:
                myTasks = _b.sent();
                // Return the user's tasks
                return [2 /*return*/, res.status(200).json({ tasks: myTasks })];
            case 2:
                err_1 = _b.sent();
                console.error("Error fetching user tasks:", err_1);
                return [2 /*return*/, res.status(500).json({ error: "Internal server error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMyTasks = getMyTasks;
// specific task
var getMyTask = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded, id, task, err_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                // Check if the token is provided
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ error: "Authorization token is required" })];
                }
                decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
                id = req.params.id;
                if (!id) {
                    return [2 /*return*/, res.status(400).json({ error: "Task ID is required" })];
                }
                return [4 /*yield*/, userModel_1.default.task.findUnique({
                        where: {
                            id: id,
                            userId: decoded.userId, // Filter tasks by the user's ID and the task's ID,
                        },
                    })];
            case 1:
                task = _b.sent();
                if (!task) {
                    return [2 /*return*/, res.status(404).json({ error: "Task not found" })];
                }
                if (task.userId !== decoded.userId) {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ error: "You are not authorized to delete this task" })];
                }
                return [2 /*return*/, res.status(200).json({ task: task })];
            case 2:
                err_2 = _b.sent();
                console.log(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getMyTask = getMyTask;
// add task
var addMyTasks = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded, _a, title, description, dueDate, newTask, err_3;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
                // Check if the token is provided
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ error: "Authorization token is required" })];
                }
                decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
                _a = req.body, title = _a.title, description = _a.description, dueDate = _a.dueDate;
                // Validate input
                if (!title || !description || !dueDate) {
                    return [2 /*return*/, res
                            .status(400)
                            .json({ error: "Title and description are required" })];
                }
                return [4 /*yield*/, userModel_1.default.task.create({
                        data: {
                            title: title,
                            description: description,
                            dueDate: dueDate,
                            userId: decoded.userId, // Associate the task with the logged-in user
                        },
                    })];
            case 1:
                newTask = _c.sent();
                // Return the created task
                return [2 /*return*/, res.status(201).json({ task: newTask })];
            case 2:
                err_3 = _c.sent();
                console.error("Error adding task:", err_3);
                return [2 /*return*/, res.status(500).json({ error: "Internal server error" })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.addMyTasks = addMyTasks;
// update task
var updateMyTasks = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded, id, _a, title, description, dueDate, status, task, updatedTask, err_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                token = (_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ error: "Authorization token is required" })];
                }
                decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
                id = req.params.id;
                _a = req.body, title = _a.title, description = _a.description, dueDate = _a.dueDate, status = _a.status;
                if (!id) {
                    return [2 /*return*/, res.status(400).json({ error: "Task ID is required" })];
                }
                return [4 /*yield*/, userModel_1.default.task.findUnique({
                        where: { id: id },
                    })];
            case 1:
                task = _c.sent();
                if (!task) {
                    return [2 /*return*/, res.status(404).json({ error: "Task not found" })];
                }
                if (task.userId !== decoded.userId) {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ error: "You are not authorized to update this task" })];
                }
                return [4 /*yield*/, userModel_1.default.task.update({
                        where: { id: id },
                        data: {
                            title: title || task.title,
                            description: description || task.description,
                            dueDate: dueDate || task.dueDate,
                            status: status,
                            updatedAt: new Date(),
                        },
                    })];
            case 2:
                updatedTask = _c.sent();
                // Return the updated task
                return [2 /*return*/, res.status(200).json({ task: updatedTask })];
            case 3:
                err_4 = _c.sent();
                // Handle errors
                if (err_4 instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    return [2 /*return*/, res.status(401).json({ error: "Invalid token" })];
                }
                console.error("Error updating task:", err_4);
                return [2 /*return*/, res.status(500).json({ error: "Internal server error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateMyTasks = updateMyTasks;
// delete task
var deleteMyTasks = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decoded, id, task, err_5;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token) {
                    return [2 /*return*/, res.status(401).json({ error: "Authorization token is required" })];
                }
                decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
                id = req.params.id;
                if (!id) {
                    return [2 /*return*/, res.status(400).json({ error: "Task ID is required" })];
                }
                return [4 /*yield*/, userModel_1.default.task.findUnique({
                        where: { id: id },
                    })];
            case 1:
                task = _b.sent();
                if (!task) {
                    return [2 /*return*/, res.status(404).json({ error: "Task not found" })];
                }
                if (task.userId !== decoded.userId) {
                    return [2 /*return*/, res
                            .status(403)
                            .json({ error: "You are not authorized to delete this task" })];
                }
                // Delete the task
                return [4 /*yield*/, userModel_1.default.task.delete({
                        where: { id: id },
                    })];
            case 2:
                // Delete the task
                _b.sent();
                return [2 /*return*/, res.status(200).json({ message: "Task deleted successfully" })];
            case 3:
                err_5 = _b.sent();
                console.error("Error deleting task:", err_5);
                return [2 /*return*/, res.status(500).json({ error: "Internal server error" })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deleteMyTasks = deleteMyTasks;
//# sourceMappingURL=tasksController.js.map