import type { Request } from "express";
import prisma from "../utils/database";

class BudayaService {
  getBudaya = async () => {
    try {
      const budaya = await prisma.budaya.findMany();
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
      });
      return budaya;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  createBudaya = async (body: Request) => {
    const { nama, deskripsi, gambar, daerahId } = body.body;
    try {
      const budaya = await prisma.budaya.create({
        data: {
          nama,
          deskripsi,
          gambar,
          daerahId: parseInt(daerahId),
        },
      });
      return budaya;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  updateBudaya = async (id: string, body: Request) => {
    const { nama, deskripsi, gambar, daerahId } = body.body;
    try {
      const budaya = await prisma.budaya.update({
        where: { id: parseInt(id) },
        data: {
          nama,
          deskripsi,
          gambar,
          daerahId: parseInt(daerahId),
        },
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
