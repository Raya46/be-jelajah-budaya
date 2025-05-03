import { Router } from "express";
// Gunakan type-only imports
import type { Request, Response, NextFunction, RequestHandler } from "express";
import UserEventRateController from "../controllers/UserEventRateController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { checkRole } from "../middlewares/checkRole";
import { Role } from "@prisma/client";

// Wrapper untuk menangani async controller methods
// Modifikasi untuk menangani promise dan error dengan lebih baik
const asyncHandler =
  (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error); // Teruskan error ke middleware error handler Express
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

// Routes Memerlukan Auth
// Jika middleware auth sudah di level aplikasi (index.ts), tidak perlu di sini
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
