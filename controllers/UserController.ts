import type { Request, Response } from "express";
import UserService from "../services/UserService";

class UserController {
  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const { user, isPasswordValid, token, error, status } =
        await UserService.login(email, password);

      if (error) {
        res.status(500).json({ message: error });
      }

      if (!isPasswordValid) {
        res.status(400).json({ message: "password not valid" });
      }

      res.status(200).json({ message: "Login berhasil", user, token });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
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

  // Mendapatkan semua user (hanya SUPER_ADMIN)
  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({ message: "success", users });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };

  // Mendapatkan user berdasarkan ID
  getUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);

      if (!user) {
        res.status(404).json({ message: "User tidak ditemukan" });
      }

      res.status(200).json({ message: "success", user });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };

  // Mendapatkan user biasa saja (untuk ADMIN_DAERAH)
  getRegularUsers = async (req: Request, res: Response) => {
    try {
      const users = await UserService.getRegularUsers();
      res.status(200).json({ message: "success", users });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };

  // Update user
  updateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await UserService.updateUser(id, req);
      res.status(200).json({ message: "User berhasil diperbarui", user });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };

  // Hapus user
  deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await UserService.deleteUser(id);
      res.status(200).json({ message: "User berhasil dihapus" });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };
}

export default new UserController();
