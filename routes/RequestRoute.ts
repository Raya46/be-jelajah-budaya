import { Router, type RequestHandler } from "express";
import RequestController from "../controllers/RequestController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { checkRole } from "../middlewares/checkRole";
import { Role } from "@prisma/client";

const router = Router();

router.get(
  "/",
  // @ts-ignore
  authMiddleware,
  checkRole([Role.SUPER_ADMIN]),
  // @ts-ignore
  RequestController.getRequest
);
router.get(
  "/:id",
  // @ts-ignore
  authMiddleware,
  checkRole([Role.SUPER_ADMIN]),
  RequestController.getRequestById
);
router.put(
  "/:id",
  // @ts-ignore
  authMiddleware,
  checkRole([Role.SUPER_ADMIN]),
  // @ts-ignore
  RequestController.updateRequest
);
router.delete(
  "/:id",
  // @ts-ignore
  authMiddleware,
  checkRole([Role.SUPER_ADMIN]),
  // @ts-ignore
  RequestController.deleteRequest
);

export default router;
