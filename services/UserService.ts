import { Prisma, Role, Status } from "@prisma/client";
import bcrypt from "bcryptjs";
import type { Request } from "express";
import { generateToken } from "../utils/auth";
import { deleteCloudinaryImage } from "../utils/cloudinary";
import prisma from "../utils/database";

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
        await prisma.user.delete({ where: { id: user.id } });
        if (ktpPath) await deleteCloudinaryImage(ktpPath);
        if (portofolioPath) await deleteCloudinaryImage(portofolioPath);
        throw new Error(
          "daerahId atau namaDaerah diperlukan untuk registrasi admin daerah"
        );
      }

      const baseData = {
        user: {
          connect: {
            id: user.id,
          },
        },
        status: Status.PENDING,
      };

      let dataForRequest;

      if (daerahId) {
        dataForRequest = {
          ...baseData,
          daerah: {
            connect: { id: parseInt(daerahId) },
          },
        };
      } else if (namaDaerah) {
        dataForRequest = {
          ...baseData,
          namaDaerah: namaDaerah,
        };
      } else {
        throw new Error(
          "Kondisi tidak valid: daerahId atau namaDaerah harus ada."
        );
      }

      const requestAdminDaerah = await prisma.requestAdminDaerah.create({
        data: dataForRequest,
      });

      const safeUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        alamat: user.alamat,
        role: user.role,
        ktp: user.ktp,
        portofolio: user.portofolio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return { user: safeUser, requestAdminDaerah };
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

  updateUser = async (id: string, body: Request) => {
    const { username, email, alamat, role } = body.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { ktp: true, portofolio: true },
    });

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
      const newKtpPath = files.ktp[0].path;
      userData.ktp = newKtpPath;
      if (existingUser?.ktp) {
        await deleteCloudinaryImage(existingUser.ktp);
      }
    }

    if (files?.portofolio?.[0]?.path) {
      const newPortofolioPath = files.portofolio[0].path;
      userData.portofolio = newPortofolioPath;
      if (existingUser?.portofolio) {
        await deleteCloudinaryImage(existingUser.portofolio);
      }
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
  };

  deleteUser = async (id: string) => {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        select: { ktp: true, portofolio: true },
      });

      await prisma.requestAdminDaerah.deleteMany({
        where: { userId: parseInt(id) },
      });

      await prisma.userEventRating.deleteMany({
        where: { userId: parseInt(id) },
      });

      const user = await prisma.user.delete({
        where: { id: parseInt(id) },
      });

      if (existingUser?.ktp) {
        await deleteCloudinaryImage(existingUser.ktp);
      }

      if (existingUser?.portofolio) {
        await deleteCloudinaryImage(existingUser.portofolio);
      }

      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default new UserService();
