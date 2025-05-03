import { User as PrismaUser, Role } from "@prisma/client";

// Definisikan tipe User yang akan disimpan di req.user
// Pilih properti yang relevan dari PrismaUser yang diambil di AuthMiddleware
type AuthenticatedUser = Pick<PrismaUser, "id" | "role" | "username" | "email">;

declare global {
  namespace Express {
    export interface Request {
      // Jadikan user opsional karena tidak semua request akan memiliki user
      user?: AuthenticatedUser;
    }
  }
}

// Tambahkan export kosong agar TypeScript mengenali file ini sebagai module
export {};
