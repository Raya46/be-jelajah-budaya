import type { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client"; // Impor enum Role dari Prisma

/**
 * Middleware untuk memeriksa apakah pengguna memiliki salah satu peran yang diizinkan.
 * @param allowedRoles Array dari peran yang diizinkan (e.g., [Role.SUPER_ADMIN, Role.ADMIN_DAERAH])
 */
const checkRole = (allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // req.user sekarang dikenali karena adanya types/express/index.d.ts
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "Akses ditolak: Peran pengguna tidak ditemukan." });
    }

    // Kita bisa asumsikan req.user.role ada dan bertipe Role di sini
    // karena sudah diperiksa di AuthMiddleware dan di atas
    const userRole = req.user.role;

    // Periksa apakah peran pengguna ada di dalam array peran yang diizinkan
    if (allowedRoles.includes(userRole)) {
      next(); // Peran sesuai, lanjutkan ke handler berikutnya
    } else {
      // Peran tidak sesuai
      return res.status(403).json({
        message: "Akses ditolak: Anda tidak memiliki izin yang cukup.",
      });
    }
  };
};

export { checkRole }; // Ekspor sebagai named export
