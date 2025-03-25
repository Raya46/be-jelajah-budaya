import type { Request, Response } from "express";
import BudayaService from "../services/BudayaService";
import type { TypeBudaya } from "@prisma/client";

class BudayaController {
  getBudaya = async (req: Request, res: Response) => {
    try {
      const budaya = await BudayaService.getBudaya(req.query.q as TypeBudaya);
      res.status(200).json({ message: "success", budaya });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  getBudayaById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const budaya = await BudayaService.getBudayaById(id);
      res.status(200).json({ message: "success", budaya });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  createBudaya = async (req: Request, res: Response) => {
    try {
      const budaya = await BudayaService.createBudaya(req);
      res.status(200).json({ message: "success", budaya });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  updateBudaya = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const budaya = await BudayaService.updateBudaya(id, req);
      res.status(200).json({ message: "success", budaya });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  deleteBudaya = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const budaya = await BudayaService.deleteBudaya(id);
      res.status(200).json({ message: "success", budaya });
    } catch (error) {
      res.status(500).json(error);
    }
  };
}

export default new BudayaController();
