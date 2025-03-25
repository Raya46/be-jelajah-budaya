import type { Request, Response } from "express";
import UserEventRateService from "../services/UserEventRateService";

class UserEventRateController {
  // Mendapatkan semua rating
  getAllRatings = async (req: Request, res: Response) => {
    try {
      const ratings = await UserEventRateService.getAllRatings();
      res.status(200).json({ message: "success", ratings });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };

  // Mendapatkan rating berdasarkan ID
  getRatingById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const rating = await UserEventRateService.getRatingById(id);

      if (!rating) {
        res.status(404).json({ message: "Rating tidak ditemukan" });
      }

      res.status(200).json({ message: "success", rating });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };

  // Mendapatkan rating berdasarkan user ID
  getRatingsByUserId = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const ratings = await UserEventRateService.getRatingsByUserId(userId);
      res.status(200).json({ message: "success", ratings });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };

  // Mendapatkan rating berdasarkan event ID
  getRatingsByEventId = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
      const ratings = await UserEventRateService.getRatingsByEventId(eventId);
      res.status(200).json({ message: "success", ratings });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };

  // User mengikuti event
  joinEvent = async (req: Request, res: Response) => {
    try {
      const userEvent = await UserEventRateService.joinEvent(req);
      res.status(201).json({
        message: "Berhasil mengikuti event",
        userEvent,
      });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };

  // User memberikan rating dan review untuk event
  rateEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const rating = await UserEventRateService.rateEvent(id, req);
      res.status(200).json({
        message: "Berhasil memberikan rating",
        rating,
      });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };

  // User membatalkan keikutsertaan dalam event
  cancelEventParticipation = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await UserEventRateService.cancelEventParticipation(id);
      res.status(200).json({
        message: "Berhasil membatalkan keikutsertaan dalam event",
      });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };

  // Mendapatkan rata-rata rating untuk suatu event
  getEventAverageRating = async (req: Request, res: Response) => {
    try {
      const { eventId } = req.params;
      const ratingData = await UserEventRateService.getEventAverageRating(
        eventId
      );
      res.status(200).json({
        message: "success",
        data: ratingData,
      });
    } catch (error: any) {
      res.status(500).json({ message: "error", error: error.message });
    }
  };
}

export default new UserEventRateController();
