import type { Request } from "express";
import prisma from "../utils/database";
import { deleteCloudinaryImage } from "../utils/cloudinary";

class ProvinsiService {
  getProvinsi = async () => {
    try {
      const [provinsi, totalCount] = await prisma.$transaction([
        prisma.provinsi.findMany(),
        prisma.provinsi.count(),
      ]);

      return { data: provinsi, totalCount };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  createProvinsi = async (req: Request) => {
    const { nama } = req.body;
    const gambarPath = req.file?.path;

    if (!gambarPath) {
      throw new Error("Gambar provinsi diperlukan");
    }

    const provinsi = await prisma.provinsi.create({
      data: {
        nama,
        gambar: gambarPath,
      },
    });
    return provinsi;
  };

  updateProvinsi = async (id: string, req: Request) => {
    const { nama } = req.body;
    const gambarPath = req.file?.path;

    const existingProvinsi = await prisma.provinsi.findUnique({
      where: { id: parseInt(id) },
      select: { gambar: true },
    });

    const dataToUpdate: { nama: string; gambar?: string } = { nama };

    if (gambarPath) {
      dataToUpdate.gambar = gambarPath;
      if (existingProvinsi?.gambar) {
        await deleteCloudinaryImage(existingProvinsi.gambar);
      }
    }

    const provinsi = await prisma.provinsi.update({
      where: {
        id: parseInt(id),
      },
      data: dataToUpdate,
    });
    return provinsi;
  };

  deleteProvinsi = async (id: string) => {
    try {
      const existingProvinsi = await prisma.provinsi.findUnique({
        where: { id: parseInt(id) },
        select: { gambar: true },
      });

      const provinsi = await prisma.provinsi.delete({
        where: {
          id: parseInt(id),
        },
      });

      if (existingProvinsi?.gambar) {
        await deleteCloudinaryImage(existingProvinsi.gambar);
      }

      return provinsi;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getProvinsiById = async (id: string) => {
    try {
      const provinsi = await prisma.provinsi.findUnique({
        where: {
          id: parseInt(id),
        },
      });
      return provinsi;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default new ProvinsiService();
