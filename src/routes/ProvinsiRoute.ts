import { Router } from "express";
import ProvinsiController from "../controllers/ProvinsiController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import upload from "../middlewares/CloudinaryUploadMiddleware";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

// @ts-ignore
router.get("/", ProvinsiController.getProvinsi);
// @ts-ignore
router.get("/:id", ProvinsiController.getProvinsiById);
router.post(
  "/create-provinsi",
  // @ts-ignore
  authMiddleware,
  checkRole(["SUPER_ADMIN"]),
  upload.single("gambar"),
  // @ts-ignore
  ProvinsiController.createProvinsi
);
router.put(
  "/:id",
  // @ts-ignore
  authMiddleware,
  checkRole(["SUPER_ADMIN"]),
  upload.single("gambar"),
  // @ts-ignore
  ProvinsiController.updateProvinsi
);
router.delete(
  "/:id",
  // @ts-ignore
  authMiddleware,
  checkRole(["SUPER_ADMIN"]),
  // @ts-ignore
  ProvinsiController.deleteProvinsi
);

export default router;
