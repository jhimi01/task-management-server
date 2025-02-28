import express from "express";
import cors from "cors";
import authRoutes from "./src/routes/authRoutes";
import tasksRoutes from "./src/routes/tasksRoutes";

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
app.use("/auth", tasksRoutes);

app.get("/", (req, res) => {
    res.send("Server is running!");
  });

export default app;
