import type { Request, Response } from "express";
import UserEventRateService from "../services/UserEventRateService";
import { Prisma } from "@prisma/client";

class UserEventRateController {
  getAllRatings = async (req: Request, res: Response) => {
    try {
      const ratings = await UserEventRateService.getAllRatings();
      res.status(200).json({ message: "success", ratings });
    } catch (error: any) {
      console.error("Error fetching all ratings:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getRatingById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const rating = await UserEventRateService.getRatingById(id);

      if (!rating) {
        return res.status(404).json({ message: "Rating tidak ditemukan" });
      }

      res.status(200).json({ message: "success", rating });
    } catch (error: any) {
      console.error("Error fetching rating by ID:", error);
      if (
        error instanceof Error &&
        error.message.includes("Invalid argument `id`")
      ) {
        return res.status(400).json({ message: "Format ID tidak valid" });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getRatingsByUserId = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const ratings = await UserEventRateService.getRatingsByUserId(userId);
      res.status(200).json({ message: "success", ratings });
    } catch (error: any) {
      console.error("Error fetching ratings by User ID:", error);
      if (
        error instanceof Error &&
        error.message.includes("Invalid argument `userId`")
      ) {
        return res.status(400).json({ message: "Format User ID tidak valid" });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getRatingsByEventId = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
      const ratings = await UserEventRateService.getRatingsByEventId(eventId);
      res.status(200).json({ message: "success", ratings });
    } catch (error: any) {
      console.error("Error fetching ratings by Event ID:", error);
      if (
        error instanceof Error &&
        error.message.includes("Invalid argument `eventId`")
      ) {
        return res.status(400).json({ message: "Format Event ID tidak valid" });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  joinEvent = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { eventId: eventIdString } = req.body;

    if (
      !eventIdString ||
      typeof eventIdString !== "string" ||
      isNaN(parseInt(eventIdString))
    ) {
      return res
        .status(400)
        .json({ message: "Event ID harus berupa angka yang valid." });
    }
    const eventId = parseInt(eventIdString);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const userEvent = await UserEventRateService.joinEvent(userId, eventId);
      res.status(201).json({
        message: "Berhasil mengikuti event",
        userEvent,
      });
    } catch (error: any) {
      console.error("Error joining event:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          return res
            .status(404)
            .json({ message: "User atau Event tidak ditemukan." });
        } else if (error.code === "P2002") {
          return res
            .status(409)
            .json({ message: "Anda sudah terdaftar di event ini." });
        }
      } else if (error instanceof Error) {
        if (error.message === "User sudah mengikuti event ini") {
          return res.status(409).json({ message: error.message });
        }
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  rateEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { rating, review } = req.body;
      if (
        rating === undefined ||
        typeof rating !== "number" ||
        rating < 1 ||
        rating > 5
      ) {
        return res
          .status(400)
          .json({ message: "Rating harus antara 1 dan 5." });
      }

      const updatedRating = await UserEventRateService.rateEvent(id, req);

      res.status(200).json({
        message: "Berhasil memberikan rating",
        rating: updatedRating,
      });
    } catch (error: any) {
      console.error("Error rating event:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return res
            .status(404)
            .json({ message: "Partisipasi event tidak ditemukan" });
        }
      } else if (
        error instanceof Error &&
        error.message.includes("Participation not found")
      ) {
        return res
          .status(404)
          .json({ message: "Partisipasi event tidak ditemukan" });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  cancelEventParticipation = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await UserEventRateService.cancelEventParticipation(id);
      res.status(200).json({
        message: "Berhasil membatalkan keikutsertaan dalam event",
      });
    } catch (error: any) {
      console.error("Error canceling participation:", error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          return res
            .status(404)
            .json({ message: "Partisipasi event tidak ditemukan" });
        }
      } else if (
        error instanceof Error &&
        error.message.includes("Participation not found")
      ) {
        return res
          .status(404)
          .json({ message: "Partisipasi event tidak ditemukan" });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getEventAverageRating = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
      const ratingData =
        await UserEventRateService.getEventAverageRating(eventId);
      if (
        ratingData === null ||
        typeof ratingData !== "object" ||
        !ratingData.hasOwnProperty("averageRating") ||
        !ratingData.hasOwnProperty("totalRatings")
      ) {
        return res.status(200).json({
          message: "success",
          data: { averageRating: 0, totalRatings: 0 },
        });
      }

      res.status(200).json({
        message: "success",
        data: ratingData,
      });
    } catch (error: any) {
      console.error("Error getting average rating:", error);
      if (
        error instanceof Error &&
        error.message.includes("Invalid argument `eventId`")
      ) {
        return res.status(400).json({ message: "Format Event ID tidak valid" });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default new UserEventRateController();
