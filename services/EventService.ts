import type { Request } from "express";
import prisma from "../utils/database";

class EventService {
  getEvent = async () => {
    try {
      const event = await prisma.event.findMany({
        include: {
          daerah: {
            select: {
              nama: true,
            },
          },
        },
      });
      return event;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  createEvent = async (body: Request) => {
    const { nama, gambar, deskripsi, tanggal, lokasi, daerahId } = body.body;
    try {
      const event = await prisma.event.create({
        data: {
          nama,
          gambar,
          daerahId: parseInt(daerahId),
          deskripsi,
          tanggal,
          lokasi,
        },
      });
      return event;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  updateEvent = async (id: string, body: Request) => {
    const { nama, gambar, deskripsi, tanggal, lokasi, daerahId } = body.body;
    try {
      const event = await prisma.event.update({
        where: {
          id: parseInt(id),
        },
        data: {
          nama,
          gambar,
          daerahId: parseInt(daerahId),
          deskripsi,
          tanggal,
          lokasi,
        },
      });
      return event;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  deleteEvent = async (id: string) => {
    try {
      const event = await prisma.event.delete({
        where: {
          id: parseInt(id),
        },
      });
      return event;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getEventById = async (id: string) => {
    try {
      const event = await prisma.event.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          daerah: {
            select: {
              nama: true,
            },
          },
        },
      });
      return event;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default new EventService();
