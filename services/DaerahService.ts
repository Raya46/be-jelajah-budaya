import type { Request } from "express";
import prisma from "../utils/database";

class DaerahService {
  getDaerah = async () => {
    try {
      const daerah = await prisma.daerah.findMany();
      return daerah;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  createDaerah = async (body: Request) => {
    const { nama, gambar, provinsiId } = body.body;
    try {
      const daerah = await prisma.daerah.create({
        data: {
          nama,
          gambar,
          provinsiId: parseInt(provinsiId),
        },
      });
      return daerah;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  updateDaerah = async (id: string, body: Request) => {
    const { nama, gambar, provinsiId } = body.body;
    try {
      const daerah = await prisma.daerah.update({
        where: {
          id: parseInt(id),
        },
        data: {
          nama,
          gambar,
          provinsiId: parseInt(provinsiId),
        },
      });
      return daerah;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  deleteDaerah = async (id: string) => {
    try {
      const daerah = await prisma.daerah.delete({
        where: {
          id: parseInt(id),
        },
      });
      return daerah;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getDaerahById = async (id: string) => {
    try {
      const daerah = await prisma.daerah.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      return daerah;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default new DaerahService();
