import type { Request, Response } from "express";
import BudayaService from "../services/BudayaService";
import { type TypeBudaya, VALID_BUDAYA_TYPES } from "../types/budaya";

const isValidTypeBudaya = (type: any): type is TypeBudaya => {
  return VALID_BUDAYA_TYPES.includes(type);
};

class BudayaController {
  getBudaya = async (req: Request, res: Response) => {
    try {
      const type = req.query.typeBudaya;
      let filter: TypeBudaya | undefined = undefined;

      if (type && typeof type === "string") {
        if (isValidTypeBudaya(type)) {
          filter = type as TypeBudaya;
        } else {
          return res
            .status(400)
            .json({ message: "Nilai typeBudaya tidak valid." });
        }
      }

      const budaya = await BudayaService.getBudaya(filter);
      res.status(200).json({ message: "success", budaya });
    } catch (error) {
      console.error("Error fetching budaya:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getBudayaById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const budaya = await BudayaService.getBudayaById(id);
      if (!budaya) {
        return res.status(404).json({ message: "Budaya tidak ditemukan" });
      }
      res.status(200).json({ message: "success", budaya });
    } catch (error) {
      console.error("Error fetching budaya by ID:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  createBudaya = async (req: Request, res: Response) => {
    try {
      const budaya = await BudayaService.createBudaya(req);
      res.status(201).json({ message: "success", budaya });
    } catch (error) {
      console.error("Error creating budaya:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  updateBudaya = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const budaya = await BudayaService.updateBudaya(id, req);
      res.status(200).json({ message: "success", budaya });
    } catch (error) {
      console.error("Error updating budaya:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  deleteBudaya = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const budaya = await BudayaService.deleteBudaya(id);
      res.status(200).json({ message: "success", budaya });
    } catch (error) {
      console.error("Error deleting budaya:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default new BudayaController();
