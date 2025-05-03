import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import type { authenticatedUser } from "../utils/auth";

const prisma = new PrismaClient();

interface JwtPayload {
  id: number;
  role: string;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Cek header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const token = authHeader?.split(" ")[1] as string;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, username: true, email: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    // @ts-ignore // Workaround jika error 'user' masih muncul
    req.user = user;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    console.error("Auth Middleware Error:", error);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ message: "Internal server error during authentication" });
    }
  }
};
