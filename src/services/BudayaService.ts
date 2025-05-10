import type { Request } from "express";
import prisma from "../utils/database";
import { deleteCloudinaryImage } from "../utils/cloudinary";
import { type TypeBudaya, VALID_BUDAYA_TYPES } from "../types/budaya";

class BudayaService {
  getBudaya = async (type?: TypeBudaya) => {
    try {
      const whereClause = type ? ({ typeBudaya: type } as any) : {};

      const [budaya, totalCount] = await prisma.$transaction([
        prisma.budaya.findMany({
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
        } as any),
        prisma.budaya.count({ where: whereClause } as any),
      ]);

      return { data: budaya, totalCount };
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
    const { nama, deskripsi, daerahId } = req.body;
    const rawTypeBudaya: unknown = req.body.typeBudaya;
    if (!req.file) {
      throw new Error("Gambar budaya diperlukan");
    }
    const gambarPath = req.file.path;

    if (
      typeof rawTypeBudaya !== "string" ||
      !VALID_BUDAYA_TYPES.includes(rawTypeBudaya)
    ) {
      throw new Error("Nilai typeBudaya tidak valid: " + rawTypeBudaya);
    }
    const typeBudaya = rawTypeBudaya as TypeBudaya;

    const budaya = await prisma.budaya.create({
      data: {
        nama,
        deskripsi,
        gambar: gambarPath,
        daerahId: parseInt(daerahId),
        typeBudaya: typeBudaya as any,
      },
    });
    return budaya;
  };

  updateBudaya = async (id: string, req: Request) => {
    const { nama, deskripsi, daerahId, gambar } = req.body;
    const rawTypeBudaya = req.body.typeBudaya;

    const existingBudaya = await prisma.budaya.findUnique({
      where: { id: parseInt(id) },
      select: { gambar: true },
    });

    const dataToUpdate: any = {
      nama,
      deskripsi,
      gambar,
    };

    if (daerahId !== undefined) {
      dataToUpdate.daerahId = parseInt(daerahId);
    }

    let typeBudaya: TypeBudaya | undefined;
    if (rawTypeBudaya !== undefined) {
      if (
        typeof rawTypeBudaya !== "string" ||
        !VALID_BUDAYA_TYPES.includes(rawTypeBudaya)
      ) {
        throw new Error("Nilai typeBudaya tidak valid: " + rawTypeBudaya);
      }
      typeBudaya = rawTypeBudaya as TypeBudaya;
      dataToUpdate.typeBudaya = typeBudaya as any;
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
