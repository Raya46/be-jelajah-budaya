import { Role } from "@prisma/client";

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
