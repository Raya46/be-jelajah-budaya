import type { Request, Response } from "express";
import UserEventRateService from "../services/UserEventRateService";

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

    try {
      const userEvent = await UserEventRateService.joinEvent(
        userId as number,
        eventId
      );
      res.status(201).json({
        message: "Berhasil mengikuti event",
        userEvent,
      });
    } catch (error: any) {
      console.error("Error joining event:", error);
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
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default new UserEventRateController();
