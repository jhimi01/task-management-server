import jwt from "jsonwebtoken";
import prisma from "../models/userModel"; // Adjust the import path as per your project structure

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
    const {
      name,
      userName,
      email,
      bio,
    } = req.body;


    // Create an update object with only the provided fields
    const updateData: any = {};
    if (name) updateData.name = name;
    if (userName) updateData.userName = userName;
    if (email) updateData.email = email;
    if (bio) {updateData.bio = bio} else{updateData.bio = ""};


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
