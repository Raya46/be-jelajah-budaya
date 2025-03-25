import type { Request, Response } from "express";
import DaerahService from "../services/DaerahService";

class DaerahController {
  getDaerah = async (req: Request, res: Response) => {
    try {
      const daerah = await DaerahService.getDaerah();
      res.status(200).json({ message: "success", daerah });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  createDaerah = async (req: Request, res: Response) => {
    try {
      const daerah = await DaerahService.createDaerah(req.body);
      res.status(200).json({ message: "success", daerah });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  updateDaerah = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const daerah = await DaerahService.updateDaerah(id, req.body);
      res.status(200).json({ message: "success", daerah });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  deleteDaerah = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const daerah = await DaerahService.deleteDaerah(id);
      res.status(200).json({ message: "success", daerah });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  getDaerahById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const daerah = await DaerahService.getDaerahById(id);
      res.status(200).json({ message: "success", daerah });
    } catch (error) {
      res.status(500).json(error);
    }
  };
}

export default new DaerahController();
