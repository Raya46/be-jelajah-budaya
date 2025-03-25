import type { Request, Response } from "express";
import EventService from "../services/EventService";

class EventController {
  getEvent = async (req: Request, res: Response) => {
    try {
      const event = await EventService.getEvent();
      res.status(200).json({ message: "success", event });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  createEvent = async (req: Request, res: Response) => {
    try {
      const event = await EventService.createEvent(req.body);
      res.status(200).json({ message: "success", event });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  updateEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await EventService.updateEvent(id, req.body);
      res.status(200).json({ message: "success", event });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  deleteEvent = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await EventService.deleteEvent(id);
      res.status(200).json({ message: "success", event });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  getEventById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);
      res.status(200).json({ message: "success", event });
    } catch (error) {
      res.status(500).json(error);
    }
  };
}

export default new EventController();
