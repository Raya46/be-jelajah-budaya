import { Router } from "express";
import DaerahController from "../controllers/DaerahController";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/", DaerahController.getDaerah);
router.get("/:id", DaerahController.getDaerahById);

router.use(authMiddleware);
router.post("/", DaerahController.createDaerah);
router.put("/:id", DaerahController.updateDaerah);
router.delete("/:id", DaerahController.deleteDaerah);

export default router;
