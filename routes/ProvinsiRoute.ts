import { Router } from "express";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import ProvinsiController from "../controllers/ProvinsiController";

const router = Router();

router.get("/provinsi", ProvinsiController.getProvinsi);
router.get("/provinsi/:id", ProvinsiController.getProvinsiById);

router.use(authMiddleware);
router.post("/provinsi", ProvinsiController.createProvinsi);
router.put("/provinsi/:id", ProvinsiController.updateProvinsi);
router.delete("/provinsi/:id", ProvinsiController.deleteProvinsi);

export default router;
