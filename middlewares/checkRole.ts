import type { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";

/**
 * @param allowedRoles
 */
const checkRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "Akses ditolak: Peran pengguna tidak ditemukan." });
    }

    const userRole = req.user.role;

    if (allowedRoles.includes(userRole)) {
      next();
    } else {
      return res.status(403).json({
        message: "Akses ditolak: Anda tidak memiliki izin yang cukup.",
      });
    }
  };
};

export { checkRole };
