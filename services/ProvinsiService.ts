import type { Request } from "express";
import prisma from "../utils/database";

class ProvinsiService {
  getProvinsi = async () => {
    try {
      const provinsi = await prisma.provinsi.findMany();
      return provinsi;
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

    try {
      const provinsi = await prisma.provinsi.create({
        data: {
          nama,
          gambar: gambarPath,
        },
      });
      return provinsi;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  updateProvinsi = async (id: string, req: Request) => {
    const { nama } = req.body;
    const gambarPath = req.file?.path;
    const dataToUpdate: { nama: string; gambar?: string } = { nama };

    if (gambarPath) {
      dataToUpdate.gambar = gambarPath;
    }

    try {
      const provinsi = await prisma.provinsi.update({
        where: {
          id: parseInt(id),
        },
        data: dataToUpdate,
      });
      return provinsi;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  deleteProvinsi = async (id: string) => {
    try {
      const provinsi = await prisma.provinsi.delete({
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
