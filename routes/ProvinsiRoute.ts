import { Router } from "express";
import ProvinsiController from "../controllers/ProvinsiController";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/", ProvinsiController.getProvinsi);
router.get("/:id", ProvinsiController.getProvinsiById);
router.use(authMiddleware)
router.post("/create", ProvinsiController.createProvinsi);
router.put("/:id", ProvinsiController.updateProvinsi);
router.delete("/:id", ProvinsiController.deleteProvinsi);

export default router;
