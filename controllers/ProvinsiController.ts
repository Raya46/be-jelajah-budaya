import type { Request, Response } from "express";
import ProvinsiService from "../services/ProvinsiService";

class ProvinsiController {
  getProvinsi = async (res: Response) => {
    try {
      const provinsi = await ProvinsiService.getProvinsi();
      res.status(200).json({ message: "success", provinsi });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  getProvinsiById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const provinsi = await ProvinsiService.getProvinsiById(id);
      res.status(200).json({ message: "success", provinsi });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  createProvinsi = async (req: Request, res: Response) => {
    try {
      const provinsi = await ProvinsiService.createProvinsi(req.body);
      res.status(200).json({ message: "success", provinsi });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  updateProvinsi = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const provinsi = await ProvinsiService.updateProvinsi(id, req.body);
      res.status(200).json({ message: "success", provinsi });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  deleteProvinsi = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const provinsi = await ProvinsiService.deleteProvinsi(id);
      res.status(200).json({ message: "success", provinsi });
    } catch (error) {
      res.status(500).json(error);
    }
  };
}

export default new ProvinsiController();
