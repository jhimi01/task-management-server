"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var tasksController_1 = require("../controllers/tasksController");
var router = express_1.default.Router();
router.get("/tasks", tasksController_1.getMyTasks);
router.get("/tasks/:id", tasksController_1.getMyTask);
router.post("/tasks", tasksController_1.addMyTasks);
router.put("/tasks/:id", tasksController_1.updateMyTasks);
router.delete("/tasks/:id", tasksController_1.deleteMyTasks);
exports.default = router;
//# sourceMappingURL=tasksRoutes.js.map