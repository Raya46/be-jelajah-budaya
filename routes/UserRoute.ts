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
router.post("/create-admin", 
  checkRole("SUPER_ADMIN"),
  UserController.createAdminDaerah);
router.get("/", 
  checkRole('SUPER_ADMIN'), 
  UserController.getAllUsers);

router.post(
  "/admin",
  upload.fields([
    { name: "ktp", maxCount: 1 },
    { name: "portofolio", maxCount: 1 },
  ]),
  UserController.registerAdminDaerah
);

// Routes untuk SUPER_ADMIN dan ADMIN_DAERAH
router.get("/regular", 
  checkRole(["SUPER_ADMIN","ADMIN_DAERAH"]),
  UserController.getRegularUsers);

// Routes untuk SUPER_ADMIN (semua user) dan ADMIN_DAERAH (hanya user biasa)
router.get("/:id", checkRole(["SUPER_ADMIN","ADMIN_DAERAH"]), UserController.getUserById);

router.put("/:id", checkRole(["SUPER_ADMIN","ADMIN_DAERAH"]), UserController.updateUser);

router.delete("/:id", checkRole(["SUPER_ADMIN","ADMIN_DAERAH"]), UserController.deleteUser);

export default router;
