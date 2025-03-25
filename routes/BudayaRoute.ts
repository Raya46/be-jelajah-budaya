import { Router } from "express";
import BudayaController from "../controllers/BudayaController";

const router = Router();

router.get("/", BudayaController.getBudaya);
router.get("/:id", BudayaController.getBudayaById);
router.post("/create-budaya", BudayaController.createBudaya);
router.put("/:id", BudayaController.updateBudaya);
router.delete("/:id", BudayaController.deleteBudaya);

export default router;
