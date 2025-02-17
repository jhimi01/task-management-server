import axios from "axios";
import prisma from "../models/userModel";
import bcrypt from "bcryptjs";
import { generateOTP } from "../utils/otp";
import { sendOTPEmail } from "../utils/email";
import jwt from "jsonwebtoken";

// login action
export const login = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    // const response = await axios.post(
    //   `https://www.google.com/recaptcha/api/siteverify`,
    //   null,
    //   {
    //     params: {
    //       secret: process.env.RECAPTCHA_SECRET_KEY,
    //       response: recaptchaToken,
    //     },
    //   }
    // );

    // if (!response.data.success) {
    //   return res.status(400).json({ error: "reCAPTCHA verification failed" });
    // }

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

// export const verifyOTPLogin = async (req: any, res: any) => {
//   const { email, otp } = req.body;

//   try {
//     // Find the user
//     const user = await prisma.user.findUnique({ where: { email } });
//     if (!user) return res.status(400).send("User not found");

//     // Check if OTP is valid and not expired
//     if (
//       user.otp !== otp ||
//       !user.otpExpiration ||
//       user.otpExpiration < new Date()
//     ) {
//       return res.status(400).send("Invalid or expired OTP");
//     }

//     // Mark user as verified
//     await prisma.user.update({
//       where: { email },
//       data: { isVerified: true },
//     });

//     // Generate JWT token
//     const token = jwt.sign(
//       { userId: user.id, email: user.email },
//       process.env.JWT_SECRET_KEY as string,
//       { expiresIn: "7d" }
//     );

//     // Update or create the logged-in user record
//     await prisma.loggedInUser.upsert({
//       where: { userId: user.id },
//       update: {
//         verifiedOtp: true,
//         token,
//       },
//       create: {
//         userId: user.id,
//         verifiedOtp: true,
//         token,
//       },
//     });

//     res.status(200).json({
//       message: "User verified successfully",
//       userData: { ...user },
//       token,
//     });

//     console.log("user data", res.status(200).json());
//   } catch (err) {
//     console.error("Error during OTP verification:", err);
//     res.status(500).send("Error during OTP verification");
//   }
// };
