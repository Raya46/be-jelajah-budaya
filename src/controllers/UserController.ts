import type { Request, Response } from "express";
import UserService from "../services/UserService";

class UserController {
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email dan password diperlukan" });
      }

      const loginResult = await UserService.login(email, password);

      if (loginResult.error) {
        const statusCode = loginResult.status || 401;
        return res.status(statusCode).json({ message: loginResult.error });
      }

      if (!loginResult.token || !loginResult.user) {
        console.error("Login service succeeded but missing token or user data");
        return res.status(500).json({ message: "Internal Server Error" });
      }

      const { password: _, ...userData } = loginResult.user;
      res.status(200).json({
        message: "Login berhasil",
        token: loginResult.token,
        user: userData,
      });
    } catch (error) {
      console.error("Error during login controller execution:", error);
      if (!res.headersSent) {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  };

  registerUser = async (req: Request, res: Response) => {
    try {
      const user = await UserService.registerUser(req);
      res.status(201).json({ message: "User berhasil dibuat", user });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };

  createAdmin = async (req: Request, res: Response) => {
    try {
      const newUser = await UserService.createAdminDaerah(req);
      res
        .status(201)
        .json({ message: "Admin daerah berhasil dibuat", user: newUser });
    } catch (error: any) {
      console.error("Error creating admin:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  registerAdminDaerah = async (req: Request, res: Response) => {
    try {
      const { user, requestAdminDaerah } =
        await UserService.registerAdminDaerah(req);
      res.status(201).json({
        message: "Admin daerah berhasil dibuat",
        user,
        requestAdminDaerah,
      });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({ message: "success", users });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const { id: requestedUserIdString } = req.params;
      const requestedUserId = parseInt(requestedUserIdString);
      const authenticatedUserId = req.user?.id;
      const authenticatedUserRole = req.user?.role;

      if (isNaN(requestedUserId)) {
        return res.status(400).json({ message: "Format User ID tidak valid" });
      }

      const isAccessingSelf = authenticatedUserId === requestedUserId;

      if (
        authenticatedUserRole === "SUPER_ADMIN" ||
        authenticatedUserRole === "ADMIN_DAERAH" ||
        isAccessingSelf
      ) {
        const user = await UserService.getUserById(requestedUserIdString);
        if (!user) {
          return res.status(404).json({ message: "User tidak ditemukan" });
        }
        return res.status(200).json({ message: "success", user: user });
      } else {
        return res.status(403).json({ message: "Akses ditolak" });
      }
    } catch (error: any) {
      console.error("Error fetching user by ID:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getRegularUsers = async (req: Request, res: Response) => {
    try {
      const users = await UserService.getRegularUsers();
      res.status(200).json({ message: "success", users });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await UserService.updateUser(id, req);
      if (!user) {
        res.status(404).json({ message: "User tidak ditemukan" });
      } else {
        res.status(200).json({ message: "User berhasil diperbarui", user });
      }
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      res.status(200).json({ message: "User berhasil dihapus" });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Gagal menghapus user" });
    }
  };
}

export default new UserController();
