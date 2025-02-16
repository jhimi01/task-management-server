import prisma from "../models/userModel";
import jwt from "jsonwebtoken";

export const getMyTasks = async (req: any, res: any) => {
    try {
      // Extract the token from the Authorization header
      const token = req.headers.authorization?.split(" ")[1];
  
      // Check if the token is provided
      if (!token) {
        return res.status(401).json({ error: "Authorization token is required" });
      }
  
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
        userId: string;
      };
  
      // Fetch tasks created by the logged-in user
      const myTasks = await prisma.task.findMany({
        where: { userId: decoded.userId }, // Filter tasks by the user's ID
      });
  
      // Return the user's tasks
      return res.status(200).json({ tasks: myTasks });
    } catch (err) {
      // Handle errors
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: "Invalid token" });
      }
  
      console.error("Error fetching user tasks:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  
 // specific task
export const getMyTask = async (req: any, res: any) => {
    try{
      const token = req.headers.authorization?.split(" ")[1];
  
      // Check if the token is provided
      if (!token) {
        return res.status(401).json({ error: "Authorization token is required" });
      }
  
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
        userId: string;
      };
  
      // Get task ID from request params
      const { id } = req.params;
  
      console.log("signle task",id)
  
      if (!id) {
        return res.status(400).json({ error: "Task ID is required" });
      }
  
      // Find the task to ensure it exists and belongs to the logged-in user
      const task = await prisma.task.findUnique({
        where: { id: id,
          userId: decoded.userId, // Filter tasks by the user's ID and the task's ID,
         },
      });
  
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      
      if (task.userId !== decoded.userId) {
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this task" });
      }
  
      return res.status(200).json({ task });
    } catch(err) {
  console.log(err)
    }
  };
  
  export const addMyTasks = async (req: any, res: any) => {
    try {
      // Extract the token from the Authorization header
      const token = req.headers.authorization?.split(" ")[1];
  
      // Check if the token is provided
      if (!token) {
        return res.status(401).json({ error: "Authorization token is required" });
      }
  
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
        userId: string;
      };
  
      // Get task data from the request body
      const { title, description, dueDate } = req.body;
  
      // Validate input
      if (!title || !description || !dueDate) {
        return res
          .status(400)
          .json({ error: "Title and description are required" });
      }
  
      // Create a new task for the authenticated user
      const newTask = await prisma.task.create({
        data: {
          title,
          description,
          dueDate,
          userId: decoded.userId, // Associate the task with the logged-in user
        },
      });
  
      // Return the created task
      return res.status(201).json({ task: newTask });
    } catch (err) {
      // Handle errors
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: "Invalid token" });
      }
  
      console.error("Error adding task:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  
  export const updateMyTasks = async (req: any, res: any) => {
    try {
      // Extract the token from the Authorization header
      const token = req.headers.authorization?.split(" ")[1];
  
      // Check if the token is provided
      if (!token) {
        return res.status(401).json({ error: "Authorization token is required" });
      }
  
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
        userId: string;
      };
  
      // Get task ID from request params
      const { id } = req.params;
  
      // Get fields to update from request body
      const { title, description, dueDate } = req.body;
  
      // Check if id is provided
      if (!id) {
        return res.status(400).json({ error: "Task ID is required" });
      }
  
      // Find the task and verify it belongs to the logged-in user
      const task = await prisma.task.findUnique({
        where: { id: id },
      });
  
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      if (task.userId !== decoded.userId) {
        return res
          .status(403)
          .json({ error: "You are not authorized to update this task" });
      }
  
      // Update the task
      const updatedTask = await prisma.task.update({
        where: { id: id },
        data: {
          title: title || task.title, // Keep the current title if not provided
          description: description || task.description, // Keep the current description if not provided
          dueDate: dueDate || task.dueDate, // Keep the current dueDate if not provided
          status: "completed", // Automatically set status to "updated"
          updatedAt: new Date(), // Automatically update the updatedAt timestamp
        },
      });
  
      // Return the updated task
      return res.status(200).json({ task: updatedTask });
    } catch (err) {
      // Handle errors
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: "Invalid token" });
      }
  
      console.error("Error updating task:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };
  
  export const deleteMyTasks = async (req: any, res: any) => {
    try {
      // Extract the token from the Authorization header
      const token = req.headers.authorization?.split(" ")[1];
  
      // Check if the token is provided
      if (!token) {
        return res.status(401).json({ error: "Authorization token is required" });
      }
  
      // Verify the JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
        userId: string;
      };
  
      // Get task ID from request params
      const { taskId } = req.params;
  
      // Check if taskId is provided
      if (!taskId) {
        return res.status(400).json({ error: "Task ID is required" });
      }
  
      // Find the task to ensure it exists and belongs to the logged-in user
      const task = await prisma.task.findUnique({
        where: { id: taskId },
      });
  
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      if (task.userId !== decoded.userId) {
        return res
          .status(403)
          .json({ error: "You are not authorized to delete this task" });
      }
  
      // Delete the task
      await prisma.task.delete({
        where: { id: taskId },
      });
  
      // Return a success response
      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
      // Handle errors
      if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: "Invalid token" });
      }
  
      console.error("Error deleting task:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  };