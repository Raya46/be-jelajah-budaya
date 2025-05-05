import type { Request } from "express";
import prisma from "../utils/database";
import { deleteCloudinaryImage } from "../utils/cloudinary";

class DaerahService {
  getDaerah = async () => {
    try {
      const [daerah, totalCount] = await prisma.$transaction([
        prisma.daerah.findMany(),
        prisma.daerah.count(),
      ]);

      return { data: daerah, totalCount };
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

    const daerah = await prisma.daerah.create({
      data: {
        nama,
        gambar: gambarPath,
        provinsiId: parseInt(provinsiId),
      },
    });
    return daerah;
  };

  updateDaerah = async (id: string, req: Request) => {
    const { nama, provinsiId, gambar } = req.body;

    const existingDaerah = await prisma.daerah.findUnique({
      where: { id: parseInt(id) },
      select: { gambar: true, provinsiId: true },
    });

    const dataToUpdate: any = {
      nama,
      provinsiId,
      gambar,
    };

    if (req.file) {
      const gambarPath = req.file.path;
      dataToUpdate.gambar = gambarPath;
      if (existingDaerah?.gambar) {
        await deleteCloudinaryImage(existingDaerah.gambar);
      }
    }

    if (provinsiId) {
      dataToUpdate.provinsiId = parseInt(provinsiId);
    }

    const daerah = await prisma.daerah.update({
      where: {
        id: parseInt(id),
      },
      data: dataToUpdate,
    });
    return daerah;
  };

  deleteDaerah = async (id: string) => {
    try {
      const existingDaerah = await prisma.daerah.findUnique({
        where: { id: parseInt(id) },
        select: { gambar: true },
      });

      const daerah = await prisma.daerah.delete({
        where: {
          id: parseInt(id),
        },
      });

      if (existingDaerah?.gambar) {
        await deleteCloudinaryImage(existingDaerah.gambar);
      }

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
