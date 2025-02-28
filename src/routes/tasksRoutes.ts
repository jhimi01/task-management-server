import express from "express";
import {
  addMyTasks,
  deleteMyTasks,
  getMyTask,
  getMyTasks,
  updateMyTasks,
} from "../controllers/tasksController";

const router = express.Router();

// router.get("/tasks", getMyTasks);
// router.get("/tasks/:id", getMyTask);
// router.post("/tasks", addMyTasks);
// router.put("/tasks/:id", updateMyTasks);
// router.delete("/tasks/:id", deleteMyTasks);

export default router;
