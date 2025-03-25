import { Router } from "express";
import EventController from "../controllers/EventController";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/", EventController.getEvent);
router.get("/:id", EventController.getEventById);

router.use(authMiddleware);
router.post("/", EventController.createEvent);
router.put("/:id", EventController.updateEvent);
router.delete("/:id", EventController.deleteEvent);

export default router;
