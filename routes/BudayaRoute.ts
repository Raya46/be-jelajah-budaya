import { Router } from "express";
import BudayaController from "../controllers/BudayaController";
import upload from "../middlewares/CloudinaryUploadMiddleware";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { checkRole } from "../middlewares/checkRole";
import { Role } from "@prisma/client";

const router = Router();

// GET (Publik)
// @ts-ignore
router.get("/", BudayaController.getBudaya);
// @ts-ignore
router.get("/:id", BudayaController.getBudayaById);

// POST (Admin Daerah / Super Admin)
router.post(
  "/create-budaya",
  // @ts-ignore
  authMiddleware,
  checkRole([Role.ADMIN_DAERAH, Role.SUPER_ADMIN]),
  upload.single("gambar"),
  // @ts-ignore
  BudayaController.createBudaya
);

// PUT (Admin Daerah / Super Admin)
router.put(
  "/:id",
  // @ts-ignore
  authMiddleware,
  checkRole([Role.ADMIN_DAERAH, Role.SUPER_ADMIN]),
  upload.single("gambar"), // Gambar opsional saat update
  // @ts-ignore
  BudayaController.updateBudaya
);

// DELETE (Admin Daerah / Super Admin)
router.delete(
  "/:id",
  // @ts-ignore
  authMiddleware,
  checkRole([Role.ADMIN_DAERAH, Role.SUPER_ADMIN]),
  // @ts-ignore
  BudayaController.deleteBudaya
);

export default router;
