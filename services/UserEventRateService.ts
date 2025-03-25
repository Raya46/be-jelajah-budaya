import type { Request } from "express";
import prisma from "../utils/database";

class UserEventRateService {
  // Mendapatkan semua rating
  getAllRatings = async () => {
    try {
      const ratings = await prisma.userEventRating.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          event: true,
        },
      });
      return ratings;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Mendapatkan rating berdasarkan ID
  getRatingById = async (id: string) => {
    try {
      const rating = await prisma.userEventRating.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
          event: true,
        },
      });
      return rating;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Mendapatkan rating berdasarkan user ID
  getRatingsByUserId = async (userId: string) => {
    try {
      const ratings = await prisma.userEventRating.findMany({
        where: { userId: parseInt(userId) },
        include: {
          event: true,
        },
      });
      return ratings;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Mendapatkan rating berdasarkan event ID
  getRatingsByEventId = async (eventId: string) => {
    try {
      const ratings = await prisma.userEventRating.findMany({
        where: { eventId: parseInt(eventId) },
        include: {
          user: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      });
      return ratings;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // User mengikuti event (membuat entri tanpa rating)
  joinEvent = async (req: Request) => {
    const { userId, eventId } = req.body;

    try {
      // Cek apakah user sudah mengikuti event ini
      const existingRating = await prisma.userEventRating.findFirst({
        where: {
          userId: parseInt(userId),
          eventId: parseInt(eventId),
        },
      });

      if (existingRating) {
        throw new Error("User sudah mengikuti event ini");
      }

      // Buat entri baru untuk user mengikuti event
      const userEvent = await prisma.userEventRating.create({
        data: {
          userId: parseInt(userId),
          eventId: parseInt(eventId),
        },
      });

      return userEvent;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // User memberikan rating dan review untuk event
  rateEvent = async (id: string, req: Request) => {
    const { rating, review } = req.body;

    try {
      // Update rating dan review
      const updatedRating = await prisma.userEventRating.update({
        where: { id: parseInt(id) },
        data: {
          rating: parseInt(rating),
          review,
        },
      });

      return updatedRating;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // User membatalkan keikutsertaan dalam event
  cancelEventParticipation = async (id: string) => {
    try {
      const deletedRating = await prisma.userEventRating.delete({
        where: { id: parseInt(id) },
      });

      return deletedRating;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  // Mendapatkan rata-rata rating untuk suatu event
  getEventAverageRating = async (eventId: string) => {
    try {
      const ratings = await prisma.userEventRating.findMany({
        where: {
          eventId: parseInt(eventId),
          rating: { not: null },
        },
        select: { rating: true },
      });

      if (ratings.length === 0) {
        return { averageRating: 0, totalRatings: 0 };
      }

      const totalRating = ratings.reduce(
        (sum, item) => sum + (item.rating || 0),
        0
      );
      const averageRating = totalRating / ratings.length;

      return {
        averageRating,
        totalRatings: ratings.length,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}

export default new UserEventRateService();
