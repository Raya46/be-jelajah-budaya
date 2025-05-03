import type { Request } from "express";
import prisma from "../utils/database";
import type { TypeBudaya } from "@prisma/client";

class BudayaService {
  getBudaya = async (type?: TypeBudaya) => {
    try {
      const whereClause = type ? { typeBudaya: type } : {};

      const budaya = await prisma.budaya.findMany({
        where: whereClause,
        include: {
          daerah: {
            select: {
              nama: true,
              provinsi: {
                select: {
                  nama: true,
                },
              },
            },
          },
        },
      });
      return budaya;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getBudayaById = async (id: string) => {
    try {
      const budaya = await prisma.budaya.findUnique({
        where: { id: parseInt(id) },
        include: {
          daerah: {
            select: {
              nama: true,
              provinsi: {
                select: {
                  nama: true,
                },
              },
            },
          },
        },
      });
      return budaya;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  createBudaya = async (req: Request) => {
    try {
      const { nama, deskripsi, daerahId, typeBudaya } = req.body;
      if (!req.file) {
        throw new Error("Gambar budaya diperlukan");
      }
      const gambarPath = req.file.path;

      const budaya = await prisma.budaya.create({
        data: {
          nama,
          deskripsi,
          gambar: gambarPath,
          daerahId: parseInt(daerahId),
          typeBudaya: typeBudaya as TypeBudaya,
        },
      });
      return budaya;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  updateBudaya = async (id: string, req: Request) => {
    try {
      const { nama, deskripsi, daerahId, typeBudaya } = req.body;
      const dataToUpdate: any = {
        nama,
        deskripsi,
      };

      if (daerahId) {
        dataToUpdate.daerahId = parseInt(daerahId);
      }
      if (typeBudaya) {
        dataToUpdate.typeBudaya = typeBudaya as TypeBudaya;
      }
      if (req.file) {
        dataToUpdate.gambar = req.file.path;
      }

      const budaya = await prisma.budaya.update({
        where: { id: parseInt(id) },
        data: dataToUpdate,
      });
      return budaya;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  deleteBudaya = async (id: string) => {
    try {
      const budaya = await prisma.budaya.delete({
        where: { id: parseInt(id) },
      });
      return budaya;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default new BudayaService();
