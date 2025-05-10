import type { Request, Response } from "express";
import ProvinsiService from "../services/ProvinsiService";

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
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  createProvinsi = async (req: Request, res: Response) => {
    try {
      const provinsi = await ProvinsiService.createProvinsi(req);
      res.status(201).json({ message: "success", provinsi });
    } catch (error) {
      console.error("Error creating provinsi:", error);
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
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default new ProvinsiController();
