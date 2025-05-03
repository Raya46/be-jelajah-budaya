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

  createDaerah = async (req: Request) => {
    const { nama, provinsiId } = req.body;
    const gambarPath = req.file?.path;

    if (!gambarPath) {
      throw new Error("Gambar daerah diperlukan");
    }

    try {
      const daerah = await prisma.daerah.create({
        data: {
          nama,
          gambar: gambarPath,
          provinsiId: parseInt(provinsiId),
        },
      });
      return daerah;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  updateDaerah = async (id: string, req: Request) => {
    const { nama, provinsiId } = req.body;
    const gambarPath = req.file?.path;
    const dataToUpdate: { nama: string; provinsiId: number; gambar?: string } =
      {
        nama,
        provinsiId: parseInt(provinsiId),
      };

    if (gambarPath) {
      dataToUpdate.gambar = gambarPath;
    }

    try {
      const daerah = await prisma.daerah.update({
        where: {
          id: parseInt(id),
        },
        data: dataToUpdate,
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
