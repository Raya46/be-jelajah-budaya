import { Router } from "express";
import EventController from "../controllers/EventController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import upload from "../middlewares/CloudinaryUploadMiddleware";
import { checkRole } from "../middlewares/checkRole";
import { Role } from "@prisma/client";

const router = Router();

// @ts-ignore
router.get("/", EventController.getEvent);
// @ts-ignore
router.get("/:id", EventController.getEventById);

router.post(
  "/",
  // @ts-ignore
  authMiddleware,
  checkRole([Role.ADMIN_DAERAH, Role.SUPER_ADMIN]),
  upload.single("gambar"),
  // @ts-ignore
  EventController.createEvent
);
router.put(
  "/:id",
  // @ts-ignore
  authMiddleware,
  checkRole([Role.ADMIN_DAERAH, Role.SUPER_ADMIN]),
  upload.single("gambar"),
  // @ts-ignore
  EventController.updateEvent
);
router.delete(
  "/:id",
  // @ts-ignore
  authMiddleware,
  checkRole([Role.ADMIN_DAERAH, Role.SUPER_ADMIN]),
  // @ts-ignore
  EventController.deleteEvent
);

export default router;
