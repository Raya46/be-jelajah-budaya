import type { Request as ExpressRequest } from "express";
import prisma from "../utils/database";
import { type Role, type RequestStatus } from "../types/common";

type RequestStatusString = "PENDING" | "ACCEPT" | "REJECT";

class RequestService {
  getRequestAdminDaerah = async () => {
    try {
      const [requestAdminDaerah, totalCount] = await prisma.$transaction([
        prisma.requestAdminDaerah.findMany({
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
        }),
        prisma.requestAdminDaerah.count(),
      ]);

      return { data: requestAdminDaerah, totalCount };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  updateRequestAdminDaerah = async (id: string, req: ExpressRequest) => {
    const { status, namaDaerah, daerahId } = req.body;

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
        data: {
          status: status as RequestStatusString,
          namaDaerah,
          daerahId: parseInt(daerahId),
        },
      });

      if (updatedRequest.status === "ACCEPT") {
        const userIdToUpdate = updatedRequest.userId;

        if (!userIdToUpdate) {
          throw new Error("User ID tidak ditemukan pada request");
        }

        await prisma.user.update({
          where: { id: userIdToUpdate },
          data: { role: "ADMIN_DAERAH" },
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

  getRequestCountsByStatus = async () => {
    try {
      const counts = await prisma.requestAdminDaerah.groupBy({
        by: ["status"],
        _count: {
          status: true,
        },
      });

      const formattedCounts: Record<RequestStatusString, number> = {
        PENDING: 0,
        ACCEPT: 0,
        REJECT: 0,
      };

      counts.forEach((item) => {
        if (
          item.status === "PENDING" ||
          item.status === "ACCEPT" ||
          item.status === "REJECT"
        ) {
          formattedCounts[item.status] = item._count.status;
        }
      });

      return formattedCounts;
    } catch (error) {
      console.error("Error getting request counts by status:", error);
      throw error;
    }
  };
}

export default new RequestService();
