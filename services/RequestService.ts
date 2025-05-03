import prisma from "../utils/database";
import type { Request as ExpressRequest } from "express";
import { Role } from "@prisma/client";
import type { RequestAdminDaerah } from "@prisma/client";

type RequestStatusString = "PENDING" | "ACCEPT" | "REJECT";

class RequestService {
  getRequestAdminDaerah = async () => {
    try {
      const requestAdminDaerah = await prisma.requestAdminDaerah.findMany({
        include: {
          daerah: {
            select: {
              nama: true,
            },
          },
          user: {
            select: {
              username: true,
              email: true,
              alamat: true,
              ktp: true,
              portofolio: true,
            },
          },
        },
      });
      return requestAdminDaerah;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  updateRequestAdminDaerah = async (id: string, req: ExpressRequest) => {
    const { status } = req.body;

    const validStatuses: RequestStatusString[] = [
      "PENDING",
      "ACCEPT",
      "REJECT",
    ];
    if (!status || !validStatuses.includes(status as RequestStatusString)) {
      throw new Error("Status tidak valid");
    }

    try {
      const existingRequest = await prisma.requestAdminDaerah.findUnique({
        where: { id: parseInt(id) },
      });

      if (!existingRequest) {
        throw new Error("Request not found");
      }

      const updatedRequest = await prisma.requestAdminDaerah.update({
        where: { id: parseInt(id) },
        data: { status: status as RequestStatusString },
      });

      if (updatedRequest.status === "ACCEPT") {
        const userIdToUpdate = updatedRequest.userId;
        const daerahIdToConnect = updatedRequest.daerahId;

        if (!userIdToUpdate) {
          throw new Error("User ID tidak ditemukan pada request");
        }

        const updateUserData: any = { role: Role.ADMIN_DAERAH };

        if (daerahIdToConnect) {
          updateUserData.daerah = {
            connect: { id: daerahIdToConnect },
          };
        }

        await prisma.user.update({
          where: { id: userIdToUpdate },
          data: updateUserData,
        });
      }

      return updatedRequest;
    } catch (error: any) {
      console.error("Error updating request:", error);
      throw error;
    }
  };

  deleteRequestAdminDaerah = async (id: string) => {
    try {
      const requestAdminDaerah = await prisma.requestAdminDaerah.delete({
        where: {
          id: parseInt(id),
        },
      });
      return requestAdminDaerah;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getRequestAdminDaerahById = async (id: string) => {
    try {
      const requestAdminDaerah = await prisma.requestAdminDaerah.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
          daerah: {
            select: {
              nama: true,
            },
          },
          user: {
            select: {
              username: true,
              email: true,
              alamat: true,
              ktp: true,
              portofolio: true,
            },
          },
        },
      });
      return requestAdminDaerah;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  createRequestAdminDaerah = async (req: ExpressRequest) => {
    // Implementation of createRequestAdminDaerah method
  };
}

export default new RequestService();
