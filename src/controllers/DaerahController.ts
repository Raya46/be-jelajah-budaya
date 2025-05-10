import type { Request, Response } from "express";
import DaerahService from "../services/DaerahService";

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
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default new DaerahController();
