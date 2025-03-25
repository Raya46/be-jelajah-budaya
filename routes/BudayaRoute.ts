import { Router } from "express";
import BudayaController from "../controllers/BudayaController";

const router = Router();

router.get("/budaya", BudayaController.getBudaya);
router.get("/budaya/:id", BudayaController.getBudayaById);
router.post("/create-budaya", BudayaController.createBudaya);
router.put("/budaya/:id", BudayaController.updateBudaya);
router.delete("/budaya/:id", BudayaController.deleteBudaya);

export default router;
