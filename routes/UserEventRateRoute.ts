import { Router } from "express";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import UserEventRateController from "../controllers/UserEventRateController";

const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };

const router = Router();

// Public routes
router.get("/", asyncHandler(UserEventRateController.getAllRatings));
router.get(
  "/event/:eventId/average",
  asyncHandler(UserEventRateController.getEventAverageRating)
);
router.get("/:id", asyncHandler(UserEventRateController.getRatingById));
router.get(
  "/event/:eventId",
  asyncHandler(UserEventRateController.getRatingsByEventId)
);

router.get(
  "/user/:userId",
  asyncHandler(UserEventRateController.getRatingsByUserId)
);
router.post("/join", asyncHandler(UserEventRateController.joinEvent));
router.put("/:id/rate", asyncHandler(UserEventRateController.rateEvent));
router.delete(
  "/:id",
  asyncHandler(UserEventRateController.cancelEventParticipation)
);

export default router;
