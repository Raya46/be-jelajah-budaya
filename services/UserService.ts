import bcrypt from "bcryptjs";
import prisma from "../utils/database";
import { generateToken } from "../utils/auth";
import type { Request } from "express";

class UserService {
  login = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      return { error: "email not found", status: 401 };
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: "password salah", status: 401 };
    }

    const token = generateToken(user);
    return { isPasswordValid, token, user };
  };

  registerUser = async (body: Request) => {
    try {
      const { username, email, password } = body.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: "USER",
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  registerAdminDaerah = async (body: Request) => {
    try {
      const {
        username,
        email,
        password,
        ktp,
        portofolio,
        alamat,
        namaDaerah,
        daerahId,
      } = body.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          ktp,
          portofolio,
          alamat,
          role: "ADMIN_DAERAH",
        },
      });
      if (namaDaerah) {
        await prisma.requestAdminDaerah.create({
          data: {
            namaDaerah,
            userId: user.id,
            daerahId,
          },
        });
      }
      const requestAdminDaerah = await prisma.requestAdminDaerah.create({
        data: {
          userId: user.id,
          daerahId,
        },
      });

      return { user, requestAdminDaerah };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Mendapatkan semua user
  getAllUsers = async () => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          alamat: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return users;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Mendapatkan user berdasarkan ID
  getUserById = async (id: string) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          alamat: true,
          ktp: true,
          portofolio: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Mendapatkan user biasa saja (role USER)
  getRegularUsers = async () => {
    try {
      const users = await prisma.user.findMany({
        where: { role: "USER" },
        select: {
          id: true,
          username: true,
          email: true,
          alamat: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return users;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Update user
  updateUser = async (id: string, body: Request) => {
    try {
      const { username, email, alamat, role } = body.body;
      const userData: any = {
        username,
        email,
        alamat,
      };

      // Hanya SUPER_ADMIN yang bisa mengubah role
      if (role && (body as any).user.role === "SUPER_ADMIN") {
        userData.role = role;
      }

      // Jika ada password baru
      if (body.body.password) {
        userData.password = await bcrypt.hash(body.body.password, 10);
      }

      const user = await prisma.user.update({
        where: { id: parseInt(id) },
        data: userData,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          alamat: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Hapus user
  deleteUser = async (id: string) => {
    try {
      // Hapus semua data terkait user terlebih dahulu
      await prisma.requestAdminDaerah.deleteMany({
        where: { userId: parseInt(id) },
      });

      await prisma.userEventRating.deleteMany({
        where: { userId: parseInt(id) },
      });

      // Hapus user
      const user = await prisma.user.delete({
        where: { id: parseInt(id) },
      });

      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default new UserService();
