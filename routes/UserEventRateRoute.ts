import { Router } from "express";
import UserEventRateController from "../controllers/UserEventRateController";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

// Public routes
router.get("/event-ratings", UserEventRateController.getAllRatings);
router.get("/get-event-ratings/:id", UserEventRateController.getRatingById);
router.get(
  "/event-ratings/event/:eventId",
  UserEventRateController.getRatingsByEventId
);
router.get(
  "/event-ratings/event/:eventId/average",
  UserEventRateController.getEventAverageRating
);

// Protected routes (memerlukan autentikasi)
router.use(authMiddleware);
router.get(
  "/event-ratings/user/:userId",
  UserEventRateController.getRatingsByUserId
);
router.post("/event-ratings/join", UserEventRateController.joinEvent);
router.put("/event-ratings/:id/rate", UserEventRateController.rateEvent);
router.delete(
  "/event-ratings/:id",
  UserEventRateController.cancelEventParticipation
);

export default router;
