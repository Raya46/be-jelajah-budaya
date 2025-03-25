import { Router } from "express";
import UserEventRateController from "../controllers/UserEventRateController";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const router = Router();

// Public routes
router.get("/", UserEventRateController.getAllRatings);
router.get("/:id", UserEventRateController.getRatingById);
router.get(
  "/event/:eventId",
  UserEventRateController.getRatingsByEventId
);
router.get(
  "/event/:eventId/average",
  UserEventRateController.getEventAverageRating
);

// Protected routes (memerlukan autentikasi)
router.use(authMiddleware);
router.get(
  "/user/:userId",
  UserEventRateController.getRatingsByUserId
);
router.post("/join", UserEventRateController.joinEvent);
router.put("/:id/rate", UserEventRateController.rateEvent);
router.delete(
  "/:id",
  UserEventRateController.cancelEventParticipation
);

export default router;
