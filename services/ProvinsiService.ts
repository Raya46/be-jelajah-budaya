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

  createProvinsi = async (body: Request) => {
    const { nama, gambar } = body.body;
    try {
      const provinsi = await prisma.provinsi.create({
        data: {
          nama,
          gambar,
        },
      });
      return provinsi;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  updateProvinsi = async (id: string, body: Request) => {
    const { nama, gambar } = body.body;
    try {
      const provinsi = await prisma.provinsi.update({
        where: {
          id: parseInt(id),
        },
        data: {
          nama,
          gambar,
        },
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
