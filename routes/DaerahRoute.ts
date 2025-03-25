import { Router } from "express";
import DaerahController from "../controllers/DaerahController";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/daerah", DaerahController.getDaerah);
router.get("/daerah/:id", DaerahController.getDaerahById);

router.use(authMiddleware);
router.post("/daerah", DaerahController.createDaerah);
router.put("/daerah/:id", DaerahController.updateDaerah);
router.delete("/daerah/:id", DaerahController.deleteDaerah);

export default router;
