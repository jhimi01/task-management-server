import prisma from "../models/userModel";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "../utils/email";
import { generateOTP } from "../utils/otp";

// Register Function
export const register = async (req: any, res: any) => {
  try {
    const { name, email, userName, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser?.isVerified) {
      return res.status(400).send("Email is already registered.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP(); // 6-digit OTP
    const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    await prisma.user.upsert({
      where: { email },
      update: { otp, otpExpiration },
      create: {
        email,
        name,
        userName,
        password: hashedPassword,
        otp,
        otpExpiration,
        isVerified: false,
      },
    });

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

// verifyOTP action
export const verifyOTP = async (req: any, res: any) => {
  try {
    const { email, otp, name, userName, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    if (
      !user.otpExpiration ||
      user.otp !== otp ||
      user.otpExpiration < new Date()
    ) {
      return res.status(400).send("Invalid or expired OTP.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        name,
        userName,
        isVerified: true,
        otp: null,
        otpExpiration: null,
      },
    });

    res.status(200).send("OTP verified. Account activated.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
