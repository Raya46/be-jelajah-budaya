import { Router } from "express";
import DaerahController from "../controllers/DaerahController";
import upload from "../middlewares/CloudinaryUploadMiddleware";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

// GET (Publik)
// @ts-ignore
router.get("/", DaerahController.getDaerah);
// @ts-ignore
router.get("/:id", DaerahController.getDaerahById);

// POST (Admin Daerah / Super Admin)
router.post(
  "/create-daerah",
  // @ts-ignore
  authMiddleware,
  checkRole(["ADMIN_DAERAH", "SUPER_ADMIN"]),
  upload.single("gambar"),
  // @ts-ignore
  DaerahController.createDaerah
);

// PUT (Admin Daerah / Super Admin)
router.put(
  "/:id",
  // @ts-ignore
  authMiddleware,
  checkRole(["ADMIN_DAERAH", "SUPER_ADMIN"]),
  upload.single("gambar"), // Gambar opsional saat update
  // @ts-ignore
  DaerahController.updateDaerah
);

// DELETE (Admin Daerah / Super Admin)
router.delete(
  "/:id",
  // @ts-ignore
  authMiddleware,
  checkRole(["ADMIN_DAERAH", "SUPER_ADMIN"]),
  // @ts-ignore
  DaerahController.deleteDaerah
);

export default router;
