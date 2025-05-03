import bcrypt from "bcryptjs";
import prisma from "../utils/database";
import { generateToken } from "../utils/auth";
import type { Request } from "express";
import { Prisma, Role } from "@prisma/client";
import type { User } from "@prisma/client";

interface UploadedFiles {
  ktp?: Express.Multer.File[];
  portofolio?: Express.Multer.File[];
}

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

  createAdminDaerah = async (body: Request) => {
    try {
      const { username, email, password, alamat, daerahId } = body.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          alamat,
          role: "ADMIN_DAERAH",
        },
      });

      if (!daerahId) {
        throw new Error("daerahId diperlukan untuk membuat admin daerah");
      }

      const requestAdminDaerah = await prisma.requestAdminDaerah.create({
        data: {
          userId: user.id,
          daerahId: parseInt(daerahId),
        },
      });

      // Pilih field yang akan dikembalikan
      const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        alamat: user.alamat,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return { user: safeUser, requestAdminDaerah };
    } catch (error) {
      console.error("Error creating admin daerah:", error);
      throw error;
    }
  };

  registerAdminDaerah = async (req: Request) => {
    try {
      const { username, email, password, alamat, namaDaerah, daerahId } =
        req.body;

      const files = req.files as UploadedFiles;
      const ktpPath = files?.ktp?.[0]?.path;
      const portofolioPath = files?.portofolio?.[0]?.path;

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          ktp: ktpPath,
          portofolio: portofolioPath,
          alamat,
          role: "ADMIN_DAERAH",
        },
      });

      if (!daerahId && !namaDaerah) {
        throw new Error(
          "daerahId atau namaDaerah diperlukan untuk registrasi admin daerah"
        );
      }

      let requestData: any = { userId: user.id };
      if (daerahId) {
        requestData.daerahId = parseInt(daerahId);
      }
      if (namaDaerah) {
        requestData.namaDaerah = namaDaerah;
      }

      const requestAdminDaerah = await prisma.requestAdminDaerah.create({
        data: requestData,
      });

      return { user, requestAdminDaerah };
    } catch (error) {
      console.error("Error registering admin daerah:", error);
      throw error;
    }
  };

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

  getRegularUsers = async () => {
    try {
      return await prisma.user.findMany({
        where: { role: Role.USER },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          ktp: true,
          alamat: true,
          portofolio: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error: any) {
      console.error("Error fetching regular users:", error);
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

      if (role && (body as any).user.role === "SUPER_ADMIN") {
        userData.role = role;
      }

      if (body.body.password) {
        userData.password = await bcrypt.hash(body.body.password, 10);
      }

      const files = (body as any).files as UploadedFiles;
      if (files?.ktp?.[0]?.path) {
        userData.ktp = files.ktp[0].path;
      }
      if (files?.portofolio?.[0]?.path) {
        userData.portofolio = files.portofolio[0].path;
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
          ktp: true,
          portofolio: true,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  deleteUser = async (id: string) => {
    try {
      await prisma.requestAdminDaerah.deleteMany({
        where: { userId: parseInt(id) },
      });

      await prisma.userEventRating.deleteMany({
        where: { userId: parseInt(id) },
      });

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
