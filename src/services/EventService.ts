import type { Request } from "express";
import prisma from "../utils/database";
import { deleteCloudinaryImage } from "../utils/cloudinary";
import { Prisma } from "@prisma/client";

class EventService {
  getEvent = async () => {
    try {
      const [event, totalCount] = await prisma.$transaction([
        prisma.event.findMany({
          include: {
            daerah: {
              select: {
                nama: true,
              },
            },
          },
        }),
        prisma.event.count(),
      ]);

      return { data: event, totalCount };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  createEvent = async (req: Request) => {
    const { nama, deskripsi, tanggal, lokasi, daerahId } = req.body;
    const gambarPath = req.file?.path;

    if (!gambarPath) {
      throw new Error("Gambar event diperlukan");
    }

    const event = await prisma.event.create({
      data: {
        nama,
        gambar: gambarPath,
        daerahId: parseInt(daerahId),
        deskripsi,
        tanggal,
        lokasi,
      },
    });
    return event;
  };

  updateEvent = async (id: string, req: Request) => {
    const { nama, deskripsi, tanggal, lokasi, daerahId } = req.body;
    const gambarPath = req.file?.path;

    const existingEvent = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      select: { gambar: true },
    });

    const dataToUpdate: Prisma.EventUpdateInput = {};

    if (nama !== undefined) {
      dataToUpdate.nama = nama;
    }
    if (deskripsi !== undefined) {
      dataToUpdate.deskripsi = deskripsi;
    }
    if (tanggal !== undefined) {
      try {
        dataToUpdate.tanggal = new Date(tanggal);
      } catch (dateError) {
        console.error("Format tanggal tidak valid:", tanggal);
        throw new Error("Format tanggal tidak valid");
      }
    }
    if (lokasi !== undefined) {
      dataToUpdate.lokasi = lokasi;
    }
    if (daerahId !== undefined) {
      const parsedDaerahId = parseInt(daerahId);
      if (!isNaN(parsedDaerahId)) {
        dataToUpdate.daerah = {
          connect: {
            id: parsedDaerahId,
          },
        };
      } else {
        console.error("daerahId tidak valid:", daerahId);
        throw new Error("daerahId tidak valid");
      }
    }

    if (gambarPath) {
      dataToUpdate.gambar = gambarPath;
      if (existingEvent?.gambar) {
        await deleteCloudinaryImage(existingEvent.gambar);
      }
    }

    const event = await prisma.event.update({
      where: {
        id: parseInt(id),
      },
      data: dataToUpdate,
    });
    return event;
  };

  deleteEvent = async (id: string) => {
    try {
      const existingEvent = await prisma.event.findUnique({
        where: { id: parseInt(id) },
        select: { gambar: true },
      });

      await prisma.userEventRating.deleteMany({
        where: { eventId: parseInt(id) },
      });

      const event = await prisma.event.delete({
        where: {
          id: parseInt(id),
        },
      });

      if (existingEvent?.gambar) {
        await deleteCloudinaryImage(existingEvent.gambar);
      }

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
