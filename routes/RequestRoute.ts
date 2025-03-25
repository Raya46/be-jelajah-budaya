import { Router } from "express";
import RequestController from "../controllers/RequestController";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/",RequestController.getRequest);
router.get("/:id",RequestController.getRequestById);

router.use(authMiddleware)
router.put("/:id",RequestController.updateRequest)
router.delete("/:id",RequestController.deleteRequest)

export default router