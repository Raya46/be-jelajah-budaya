import type { Request } from "express";
import prisma from "../utils/database";
import type { TypeBudaya } from "@prisma/client";
import { deleteCloudinaryImage } from "../utils/cloudinary";

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
  };

  updateBudaya = async (id: string, req: Request) => {
    const { nama, deskripsi, daerahId, typeBudaya, gambar } = req.body;

    const existingBudaya = await prisma.budaya.findUnique({
      where: { id: parseInt(id) },
      select: { gambar: true },
    });

    const dataToUpdate: any = {
      nama,
      deskripsi,
      gambar,
      daerahId,
      typeBudaya,
    };

    if (daerahId) {
      dataToUpdate.daerahId = parseInt(daerahId);
    }
    if (typeBudaya) {
      dataToUpdate.typeBudaya = typeBudaya as TypeBudaya;
    }

    if (req.file) {
      const newGambarPath = req.file.path;
      dataToUpdate.gambar = newGambarPath;

      if (existingBudaya?.gambar) {
        await deleteCloudinaryImage(existingBudaya.gambar);
      }
    }

    const budaya = await prisma.budaya.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });
    return budaya;
  };

  deleteBudaya = async (id: string) => {
    try {
      const existingBudaya = await prisma.budaya.findUnique({
        where: { id: parseInt(id) },
        select: { gambar: true },
      });

      const budaya = await prisma.budaya.delete({
        where: { id: parseInt(id) },
      });

      if (existingBudaya?.gambar) {
        await deleteCloudinaryImage(existingBudaya.gambar);
      }

      return budaya;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default new BudayaService();
