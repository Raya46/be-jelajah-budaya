import type { Request, Response } from "express";
import ProvinsiService from "../services/ProvinsiService";
import { Prisma } from "@prisma/client";

class ProvinsiController {
  getProvinsi = async (req: Request, res: Response) => {
    try {
      const provinsi = await ProvinsiService.getProvinsi();
      res.status(200).json({ message: "success", provinsi });
    } catch (error) {
      console.error("Error fetching provinsi:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getProvinsiById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const provinsi = await ProvinsiService.getProvinsiById(id);
      if (!provinsi) {
        return res.status(404).json({ message: "Provinsi tidak ditemukan" });
      }
      res.status(200).json({ message: "success", provinsi });
    } catch (error) {
      console.error("Error fetching provinsi by ID:", error);
      if (
        error instanceof Error &&
        error.message.includes("Invalid argument `id`")
      ) {
        return res.status(400).json({ message: "Format ID tidak valid" });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  createProvinsi = async (req: Request, res: Response) => {
    try {
      const provinsi = await ProvinsiService.createProvinsi(req);
      res.status(201).json({ message: "success", provinsi });
    } catch (error) {
      console.error("Error creating provinsi:", error);
      if (
        error instanceof Error &&
        error.message.includes("Gambar provinsi diperlukan")
      ) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  updateProvinsi = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const provinsi = await ProvinsiService.updateProvinsi(id, req);
      res
        .status(200)
        .json({ message: "Provinsi berhasil diperbarui", provinsi });
    } catch (error: any) {
      console.error("Error updating provinsi:", error);
      if (
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025") ||
        error.message === "Provinsi not found"
      ) {
        return res.status(404).json({ message: "Provinsi tidak ditemukan" });
      } else if (
        error instanceof Error &&
        error.message.includes("Format ID")
      ) {
        return res
          .status(400)
          .json({ message: "Format ID provinsi tidak valid" });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  deleteProvinsi = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await ProvinsiService.deleteProvinsi(id);
      res.status(200).json({ message: "Provinsi berhasil dihapus" });
    } catch (error) {
      console.error("Error deleting provinsi:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return res.status(404).json({ message: "Provinsi tidak ditemukan" });
        }
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default new ProvinsiController();
