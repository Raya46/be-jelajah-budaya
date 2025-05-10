import type { Request, Response } from "express";
import EventService from "../services/EventService";

class EventController {
  getEvent = async (req: Request, res: Response) => {
    try {
      const event = await EventService.getEvent();
      res.status(200).json({ message: "success", event });
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  createEvent = async (req: Request, res: Response) => {
    try {
      const event = await EventService.createEvent(req);
      res.status(201).json({ message: "success", event });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  updateEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await EventService.updateEvent(id, req);
      res.status(200).json({ message: "Event berhasil diperbarui", event });
    } catch (error: any) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  deleteEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await EventService.deleteEvent(id);
      res.status(200).json({ message: "success", event });
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  getEventById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);
      if (!event) {
        return res.status(404).json({ message: "Event tidak ditemukan" });
      }
      res.status(200).json({ message: "success", event });
    } catch (error) {
      console.error("Error fetching event by ID:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default new EventController();
