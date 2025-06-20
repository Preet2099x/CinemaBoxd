import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const oauthController = async (req, res) => {
  try {
    const { name, email, photoURL, uid, provider = "google" } = req.body;

    if (!email || !uid) {
      return res.status(400).json({
        success: false,
        message: "Missing required OAuth data (email or uid)",
      });
    }

    // Check if user already exists
    let existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      // Create a new user (no password)
      existingUser = await prisma.user.create({
        data: {
          username: name.replace(/\s/g, "_").toLowerCase(), // basic username fallback
          email,
          oauthProvider: provider,
          oauthId: uid,
          profilePic: photoURL,
        },
      });
    }

    return res.status(200).json({
      success: true,
      message: "OAuth login/signup successful",
      userid: existingUser.id,
    });
  } catch (error) {
    console.error("OAuth error:", error);
    res.status(500).json({
      success: false,
      message: "Error handling OAuth login/signup",
      error: error.message,
    });
  }
};

export default oauthController;
