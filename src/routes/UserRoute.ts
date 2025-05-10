import { Router } from "express";
import UserController from "../controllers/UserController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import upload from "../middlewares/CloudinaryUploadMiddleware";
import { checkRole } from "../middlewares/checkRole";

const router = Router();

// Public routes
// @ts-ignore
router.post("/login", UserController.login);
// @ts-ignore
router.post("/register-user", UserController.registerUser);
// @ts-ignore
router.post(
  "/register-admin",
  upload.fields([
    { name: "ktp", maxCount: 1 },
    { name: "portofolio", maxCount: 1 },
  ]),
  UserController.registerAdminDaerah
);

// Protected routes

router.post(
  "/create-admin",
  // @ts-ignore
  authMiddleware,
  checkRole(["SUPER_ADMIN"]),
  UserController.createAdmin
);
router.get(
  "/",
  // @ts-ignore
  authMiddleware,
  checkRole(["SUPER_ADMIN"]),
  // @ts-ignore
  UserController.getAllUsers
);

router.get(
  "/regular",
  // @ts-ignore
  authMiddleware,
  checkRole(["SUPER_ADMIN", "ADMIN_DAERAH"]),
  // @ts-ignore
  UserController.getRegularUsers
);

router.get(
  "/:id",
  // @ts-ignore
  authMiddleware,
  checkRole(["SUPER_ADMIN", "ADMIN_DAERAH"]),
  // @ts-ignore
  UserController.getUserById
);

router.put(
  "/:id",
  // @ts-ignore
  authMiddleware,
  checkRole(["SUPER_ADMIN", "ADMIN_DAERAH"]),
  upload.fields([
    { name: "ktp", maxCount: 1 },
    { name: "portofolio", maxCount: 1 },
  ]),
  // @ts-ignore
  UserController.updateUser
);

router.delete(
  "/:id",
  // @ts-ignore
  authMiddleware,
  checkRole(["SUPER_ADMIN", "ADMIN_DAERAH"]),
  // @ts-ignore
  UserController.deleteUser
);

export default router;
