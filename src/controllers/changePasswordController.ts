import prisma from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// change password
export const changePasswordController = async (req: any, res: any) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }
  const { email, oldPassword, newPassword } = req.body;

  if (!oldPassword) {
    return res.status(401).json({ error: "you can't change password" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as {
      userId: string;
    };

    const { userId } = decoded;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (!user || !user.password) {
      return res.status(400).json({ error: "User or password is missing." });
    }

    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return res.status(400).send("Incorrect old password");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { password: hashedNewPassword },
    });

    const newToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "7d" }
    );

    await prisma.loggedInUser.upsert({
      where: { userId: user.id },
      update: {
        token: newToken,
      },
      create: {
        userId: user.id,
        token: newToken,
        verifiedOtp: true,
      },
    });

    return res.status(200).json({
      message: "Password updated successfully",
      token: newToken,
      userData: user,
    });
  } catch (err) {
    console.error("Error during password reset:", err);
    return res.status(500).send("Error during password reset");
  }
};

// send mail
export const forgotPasswordController = async (req: any, res: any) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }
    if (user && !user.password) {
      return res.status(400).json({
        error:
          "Try logging in with your Gmail account using the same email address",
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "7d" }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset your password",
      text: `https://task-management-client-chi-nine.vercel.app/forgot-password/${user.id}/${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Error during password reset");
      } else {
        console.log("Email sent: " + info.response);
        return res.status(200).json({ message: "Email sent" });
      }
    });
  } catch (error) {
    console.error("Error during email sending:", error);
    return res.status(500).send("Internal server error");
  }
};

// reset password
export const resetPasswordController = async (req: any, res: any) => {
  const { id, token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) {
    return res.status(400).json({ error: "New password is required" });
  }

  try {
    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string
    );

    if (decoded.userId !== id) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in reset password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
