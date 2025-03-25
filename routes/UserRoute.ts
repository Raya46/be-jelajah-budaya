import { Router } from "express";
import multer from "multer";
import UserController from "../controllers/UserController";
import { authMiddleware, checkRole } from "../middlewares/AuthMiddleware";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Public routes
router.post("/login", UserController.login);
router.post("/register-user", UserController.registerUser);
router.post(
  "/register-admin",
  upload.fields([
    { name: "ktp", maxCount: 1 },
    { name: "portofolio", maxCount: 1 },
  ]),
  UserController.registerAdminDaerah
);

// Protected routes
router.use(authMiddleware);

// Routes untuk SUPER_ADMIN
router.get("/users", UserController.getAllUsers);

router.post(
  "/users/admin",
  upload.fields([
    { name: "ktp", maxCount: 1 },
    { name: "portofolio", maxCount: 1 },
  ]),
  UserController.registerAdminDaerah
);

// Routes untuk SUPER_ADMIN dan ADMIN_DAERAH
router.get("/users/regular", UserController.getRegularUsers);

// Routes untuk SUPER_ADMIN (semua user) dan ADMIN_DAERAH (hanya user biasa)
router.get("/users/:id", authMiddleware, UserController.getUserById);

router.put("/users/:id", authMiddleware, UserController.updateUser);

router.delete("/users/:id", authMiddleware, UserController.deleteUser);

export default router;
