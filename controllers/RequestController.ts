import type { Request, Response } from "express";
import RequestService from "../services/RequestService";
import { Prisma } from "@prisma/client";

class RequestController {
  getRequest = async (req: Request, res: Response) => {
    try {
      const request = await RequestService.getRequestAdminDaerah();
      res.status(200).json({ message: "success", request });
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  updateRequest = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const requestAdminDaerah = await RequestService.updateRequestAdminDaerah(
        id,
        req
      );
      res.status(200).json({
        message: "Request berhasil diperbarui",
        request: requestAdminDaerah,
      });
    } catch (error: any) {
      console.error("Error updating request:", error);
      if (
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025") ||
        error.message === "Request not found" ||
        error.message === "Status tidak valid"
      ) {
        const statusCode = error.message === "Status tidak valid" ? 400 : 404;
        return res.status(statusCode).json({ message: error.message });
      } else if (
        error instanceof Error &&
        error.message.includes("Format ID")
      ) {
        return res
          .status(400)
          .json({ message: "Format ID request tidak valid" });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  deleteRequest = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const request = await RequestService.deleteRequestAdminDaerah(id);
      res.status(200).json({ message: "success", request });
    } catch (error) {
      console.error("Error deleting request:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return res.status(404).json({ message: "Request tidak ditemukan" });
        }
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getRequestById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const request = await RequestService.getRequestAdminDaerahById(id);
      if (!request) {
        return res.status(404).json({ message: "Request tidak ditemukan" });
      }
      res.status(200).json({ message: "success", request });
    } catch (error) {
      console.error("Error fetching request by ID:", error);
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

export default new RequestController();
