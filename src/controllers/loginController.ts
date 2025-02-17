import axios from "axios";
import prisma from "../models/userModel";
import bcrypt from "bcryptjs";
import { generateOTP } from "../utils/otp";
import { sendOTPEmail } from "../utils/email";
import jwt from "jsonwebtoken";

// login action
export const login = async (req: any, res: any) => {
  const { email, password, recaptchaToken } = req.body;

  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      }
    );

    if (!response.data.success) {
      return res.status(400).json({ error: "reCAPTCHA verification failed" });
    }

    // Find the user in the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }

    if (!user || !user.password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare password (hashed)
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "7d" }
    );

    // console.log("dgfdjgsfjgjfhg", process.env.JWT_SECRET_KEY)

    await prisma.loggedInUser.upsert({
      where: { userId: user.id },
      update: {
        verifiedOtp: true,
        token,
      },
      create: {
        userId: user.id,
        verifiedOtp: true,
        token,
      },
    });

    // await sendOTPEmail(email, otp);
    // return res.status(200).json({ message: "OTP sent to your email" });
    res.status(200).json({
      message: "User verified successfully",
      userData: { ...user },
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send("Error during login");
  }
};

// loggedIn user data
export const getUserData = async (req: any, res: any) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    // console.log("tooooooooooooken user", req.headers.authorization);

    if (!token) {
      return res.status(401).json({ error: "Authorization token is required" });
    }
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      userId: string;
    };

    // Find the user by the ID from the decoded token
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        LoggedInUser: true, // Include related LoggedInUser data
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the user data along with the logged-in information
    return res.status(200).json({
      message: "User data retrieved successfully",
      userData: { ...user },
      loggedInUser: user.LoggedInUser,
    });
  } catch (error) {
    console.error("Error during token verification:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

// update user information
export const editProfileController = async (req: any, res: any) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token in headers
  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    // Decode token to extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      userId: string;
    };

    // Extract the userId from loggedInUser
    const { userId } = decoded;

    // Validate and extract only the fields to update
    const { name, userName, email, bio } = req.body;

    // Check if the new email already exists for another user
    // if (email) {
    //   const existingUser = await prisma.user.findUnique({
    //     where: { email: email },
    //   });

    //   // If the email exists and belongs to another user, return an error
    //   if (existingUser && existingUser.id !== userId) {
    //     return res.status(400).json({ error: "Email is already in use" });
    //   }
    // }

    // Create an update object with only the provided fields
    const updateData: any = {};
    if (name) updateData.name = name;
    if (userName) updateData.userName = userName;
    if (email) updateData.email = email;
    if (bio) {
      updateData.bio = bio;
    } else {
      updateData.bio = "";
    }

    // Update the user in the database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return res.status(200).json({
      message: "User profile updated successfully",
      userData: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const imageEditController = async (req: any, res: any) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token in headers
  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    // Decode token to extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      userId: string;
    };
    const { userId } = decoded;
    const { img } = req.body;

    if (!img) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    // Update the user's profile image
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { img },
    });

    return res.status(200).json({
      message: "User profile updated successfully",
      userData: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logOutController = async (req: any, res: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  try {
    // Decode token to extract the userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      userId: string;
    };

    const { userId } = decoded;

    if (!userId) {
      return res.status(400).json({ error: "Invalid token payload" });
    }

    // Delete LoggedInUser record
    await prisma.loggedInUser.delete({
      where: { userId },
    });

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ error: "Failed to logout" });
  }
};