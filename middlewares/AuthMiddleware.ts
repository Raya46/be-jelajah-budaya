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
      res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const token = authHeader?.split(" ")[1] as string;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      res.status(401).json({ message: "Unauthorized - User not found" });
    }

    (req as any).user = {
      id: user?.id,
      role: user?.role,
      username: user?.username,
      email: user?.email,
    } as authenticatedUser;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user as authenticatedUser;

    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userHasRole = Array.isArray(roles)
      ? roles.includes(user.role)
      : user.role === roles;

    if (!userHasRole) {
      res.status(403).json({ message: "Forbidden - Insufficient permissions" });
      return;
    }

    next();
  };
};

