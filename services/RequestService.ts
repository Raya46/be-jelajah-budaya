import type { Request } from "express";
import prisma from "../utils/database";

class RequestService {
  getRequestAdminDaerah = async () => {
    try {
      const requestAdminDaerah = await prisma.requestAdminDaerah.findMany({
        include: {
          daerah: {
            select: {
              nama: true,
            },
          },
          user: {
            select: {
              username: true,
              email: true,
              alamat: true,
              ktp: true,
              portofolio: true,
            },
          },
        },
      });
      return requestAdminDaerah;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  updateRequestAdminDaerah = async (id: string, body: Request) => {
    const { namaDaerah, userId, daerahId } = body.body;
    try {
      const requestAdminDaerah = await prisma.requestAdminDaerah.update({
        where: {
          id: parseInt(id),
        },
        data: {
          namaDaerah,
          userId: parseInt(userId),
          daerahId: parseInt(daerahId),
        },
      });
      return requestAdminDaerah;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  deleteRequestAdminDaerah = async (id: string) => {
    try {
      const requestAdminDaerah = await prisma.requestAdminDaerah.delete({
        where: {
          id: parseInt(id),
        },
      });
      return requestAdminDaerah;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getRequestAdminDaerahById = async (id: string) => {
    try {
      const requestAdminDaerah = await prisma.requestAdminDaerah.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          daerah: {
            select: {
              nama: true,
            },
          },
          user: {
            select: {
              username: true,
              email: true,
              alamat: true,
              ktp: true,
              portofolio: true,
            },
          },
        },
      });
      return requestAdminDaerah;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default new RequestService();
