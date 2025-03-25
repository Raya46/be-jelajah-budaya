import { Router } from "express";
import EventController from "../controllers/EventController";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

router.get("/events", EventController.getEvent);
router.get("/events/:id", EventController.getEventById);

router.use(authMiddleware);
router.post("/events", EventController.createEvent);
router.put("/events/:id", EventController.updateEvent);
router.delete("/events/:id", EventController.deleteEvent);

export default router;
