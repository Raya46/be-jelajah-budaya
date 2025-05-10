import type { Request, Response } from "express";
import DaerahService from "../services/DaerahService";
import { Prisma } from "@prisma/client";

class DaerahController {
  getDaerah = async (req: Request, res: Response) => {
    try {
      const daerah = await DaerahService.getDaerah();
      res.status(200).json({ message: "success", daerah });
    } catch (error) {
      console.error("Error fetching daerah:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  createDaerah = async (req: Request, res: Response) => {
    try {
      const daerah = await DaerahService.createDaerah(req);
      res.status(201).json({ message: "success", daerah });
    } catch (error) {
      console.error("Error creating daerah:", error);
      if (
        error instanceof Error &&
        error.message.includes("Gambar daerah diperlukan")
      ) {
        return res.status(400).json({ message: error.message });
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          return res.status(400).json({ message: "Provinsi ID tidak valid." });
        }
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  updateDaerah = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const daerah = await DaerahService.updateDaerah(id, req);
      if (!daerah) {
        return res.status(404).json({ message: "Daerah tidak ditemukan" });
      }
      res.status(200).json({ message: "success", daerah });
    } catch (error) {
      console.error("Error updating daerah:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return res.status(404).json({ message: "Daerah tidak ditemukan" });
        }
        if (error.code === "P2003") {
          return res.status(400).json({ message: "Provinsi ID tidak valid." });
        }
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  deleteDaerah = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const daerah = await DaerahService.deleteDaerah(id);
      res.status(200).json({ message: "success", daerah });
    } catch (error) {
      console.error("Error deleting daerah:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return res.status(404).json({ message: "Daerah tidak ditemukan" });
        }
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getDaerahById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const daerah = await DaerahService.getDaerahById(id);
      if (!daerah) {
        return res.status(404).json({ message: "Daerah tidak ditemukan" });
      }
      res.status(200).json({ message: "success", daerah });
    } catch (error) {
      console.error("Error fetching daerah by ID:", error);
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

export default new DaerahController();
