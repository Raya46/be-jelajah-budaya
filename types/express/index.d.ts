import { User as PrismaUser, Role } from "@prisma/client";

type AuthenticatedUser = Pick<PrismaUser, "id" | "role" | "username" | "email">;

declare global {
  namespace Express {
    export interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
