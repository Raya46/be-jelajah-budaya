import { Role } from "@prisma/client";

// Definisikan tipe untuk informasi user yang disimpan di req.user
declare global {
  namespace Express {
    export interface AuthenticatedUserInfo {
      id: number;
      role: Role;
      username: string;
      email: string;
    }
  }
}
