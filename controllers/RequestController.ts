import type { Request, Response } from "express";
import RequestService from "../services/RequestService";

class RequestController {
  getRequest = async (req: Request, res: Response) => {
    try {
      const request = await RequestService.getRequestAdminDaerah();
      res.status(200).json({ message: "success", request });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  updateRequest = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const request = await RequestService.updateRequestAdminDaerah(
        id,
        req.body
      );
      res.status(200).json({ message: "success", request });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  deleteRequest = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const request = await RequestService.deleteRequestAdminDaerah(id);
      res.status(200).json({ message: "success", request });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  getRequestById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const request = await RequestService.getRequestAdminDaerahById(id);
      res.status(200).json({ message: "success", request });
    } catch (error) {
      res.status(500).json(error);
    }
  };
}

export default new RequestController();
