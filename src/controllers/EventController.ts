import type { Request, Response } from "express";
import EventService from "../services/EventService";
import { Prisma } from "@prisma/client";

class EventController {
  getEvent = async (req: Request, res: Response) => {
    try {
      const event = await EventService.getEvent();
      res.status(200).json({ message: "success", event });
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  createEvent = async (req: Request, res: Response) => {
    try {
      const event = await EventService.createEvent(req);
      res.status(201).json({ message: "success", event });
    } catch (error) {
      console.error("Error creating event:", error);
      if (
        error instanceof Error &&
        error.message.includes("Gambar event diperlukan")
      ) {
        return res.status(400).json({ message: error.message });
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          return res.status(400).json({ message: "Daerah ID tidak valid." });
        }
      }
      if (
        error instanceof Error &&
        error.message.includes("Invalid date string")
      ) {
        return res.status(400).json({ message: "Format tanggal tidak valid." });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  updateEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await EventService.updateEvent(id, req);
      res.status(200).json({ message: "Event berhasil diperbarui", event });
    } catch (error: any) {
      console.error("Error updating event:", error);
      if (
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025") ||
        error.message === "Event not found"
      ) {
        return res.status(404).json({ message: "Event tidak ditemukan" });
      } else if (
        error instanceof Error &&
        error.message.includes("Format ID")
      ) {
        return res.status(400).json({ message: "Format ID event tidak valid" });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  deleteEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await EventService.deleteEvent(id);
      res.status(200).json({ message: "success", event });
    } catch (error) {
      console.error("Error deleting event:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return res.status(404).json({ message: "Event tidak ditemukan" });
        }
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getEventById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);
      if (!event) {
        return res.status(404).json({ message: "Event tidak ditemukan" });
      }
      res.status(200).json({ message: "success", event });
    } catch (error) {
      console.error("Error fetching event by ID:", error);
      if (
        error instanceof Error &&
        error.message.includes("Invalid argument `id`")
      ) {
        return res.status(400).json({ message: "Format ID tidak valid" });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default new EventController();
