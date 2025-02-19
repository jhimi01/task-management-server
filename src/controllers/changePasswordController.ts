import prisma from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
