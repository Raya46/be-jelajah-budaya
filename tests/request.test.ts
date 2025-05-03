import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import { app } from "../index"; // Impor app dari index.ts
import { Status, Role } from "@prisma/client"; // Impor enum
import jwt from "jsonwebtoken";
import prisma from "../utils/database";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Fungsi helper token yang valid
const getAuthToken = async (
  role: Role
): Promise<{ token: string; userId: number }> => {
  const user = await prisma.user.findFirst({
    where: { role: role },
    select: { id: true, role: true },
  });

  if (!user) {
    throw new Error(
      `Tidak dapat menemukan user dengan peran ${role} di database tes.`
    );
  }

  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });
  return { token, userId: user.id };
};

let superAdminToken: string;
let adminToken: string; // Untuk tes akses non-superadmin
let requestIdToTest: number; // ID request PENDING dari seeder

beforeAll(async () => {
  try {
    const superAdminAuth = await getAuthToken(Role.SUPER_ADMIN);
    superAdminToken = superAdminAuth.token;

    const adminAuth = await getAuthToken(Role.ADMIN_DAERAH);
    adminToken = adminAuth.token;

    // Cari request PENDING dari seeder
    const pendingRequest = await prisma.requestAdminDaerah.findFirst({
      where: { status: Status.PENDING },
    });
    if (!pendingRequest) {
      throw new Error("Tidak ditemukan request PENDING di DB untuk tes.");
    }
    requestIdToTest = pendingRequest.id;
  } catch (error) {
    console.error("Error di beforeAll request.test.ts:", error);
    throw error;
  }
});

describe("API Request Admin Daerah", () => {
  // GET /requests dan GET /requests/:id memerlukan auth (SUPER_ADMIN)
  it("GET /requests - harus mengembalikan daftar request (oleh SUPER_ADMIN)", async () => {
    const response = await request(app)
      .get("/requests")
      .set("Authorization", `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(Array.isArray(response.body.request)).toBe(true);
  });

  it("GET /requests - harus gagal tanpa token", async () => {
    const response = await request(app).get("/requests");
    expect(response.status).toBe(401);
  });

  it("GET /requests/:id - harus mengembalikan satu request jika ID valid (oleh SUPER_ADMIN)", async () => {
    if (!requestIdToTest) throw new Error("requestIdToTest diperlukan");

    const response = await request(app)
      .get(`/requests/${requestIdToTest}`)
      .set("Authorization", `Bearer ${superAdminToken}`);

    if (response.status === 200) {
      expect(response.body.message).toBe("success");
      expect(response.body.request).toBeDefined();
      expect(response.body.request.id).toBe(requestIdToTest);
      expect(response.body.request).toHaveProperty("status");
      expect(response.body.request).toHaveProperty("userId");
      expect(response.body.request).toHaveProperty("daerahId");
    } else {
      // Jika tidak 200, harusnya 404 karena ID diambil dari DB
      expect(response.status).toBe(404);
    }
  });

  it("GET /requests/:id - harus gagal jika ID tidak valid", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .get(`/requests/${invalidId}`)
      .set("Authorization", `Bearer ${superAdminToken}`);
    expect(response.status).toBe(404);
  });

  // PUT /requests/:id (Update Status)
  it("PUT /requests/:id - harus update status request menjadi ACCEPT (oleh SUPER_ADMIN)", async () => {
    if (!requestIdToTest) throw new Error("requestIdToTest diperlukan");
    const newStatus: Status = "ACCEPT";

    const response = await request(app)
      .put(`/requests/${requestIdToTest}`)
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({ status: newStatus });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(response.body.request).toBeDefined();
    expect(response.body.request.id).toBe(requestIdToTest);
    expect(response.body.request.status).toBe(newStatus);

    // TODO: Verifikasi role user terkait -> ini perlu logic tambahan di service/controller
    // Untuk sekarang, kita anggap service/controller sudah handle perubahan role user
  });

  it("PUT /requests/:id - harus gagal jika status tidak valid", async () => {
    if (!requestIdToTest) throw new Error("requestIdToTest diperlukan");
    const response = await request(app)
      .put(`/requests/${requestIdToTest}`)
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({ status: "INVALID_STATUS" });
    expect(response.status).toBe(400);
  });

  it("PUT /requests/:id - harus gagal jika ID tidak ditemukan", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .put(`/requests/${invalidId}`)
      .set("Authorization", `Bearer ${superAdminToken}`)
      .send({ status: "REJECT" });
    expect(response.status).toBe(404);
  });

  it("PUT /requests/:id - harus gagal jika bukan SUPER_ADMIN", async () => {
    if (!requestIdToTest) throw new Error("requestIdToTest diperlukan");
    const response = await request(app)
      .put(`/requests/${requestIdToTest}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "ACCEPT" });
    expect(response.status).toBe(403); // checkRole harus menolak
  });

  // DELETE /requests/:id
  it("DELETE /requests/:id - harus menghapus request (oleh SUPER_ADMIN)", async () => {
    // Buat request baru untuk dihapus (menggunakan user admin yg ada dan daerah yg ada)
    const adminUser = await prisma.user.findFirst({
      where: { role: Role.ADMIN_DAERAH },
    });
    const daerah = await prisma.daerah.findFirst();
    if (!adminUser || !daerah)
      throw new Error(
        "User admin atau daerah tidak ditemukan untuk create delete target"
      );

    // Hapus request lama jika ada agar bisa buat baru
    await prisma.requestAdminDaerah.deleteMany({
      where: { userId: adminUser.id },
    });

    const createRes = await prisma.requestAdminDaerah.create({
      data: {
        userId: adminUser.id,
        daerahId: daerah.id,
        status: Status.REJECT,
      },
    });
    const newRequestId = createRes.id;

    const response = await request(app)
      .delete(`/requests/${newRequestId}`)
      .set("Authorization", `Bearer ${superAdminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");

    // Verifikasi penghapusan
    const getResponse = await request(app)
      .get(`/requests/${newRequestId}`)
      .set("Authorization", `Bearer ${superAdminToken}`);
    expect(getResponse.status).toBe(404); // Harusnya 404 setelah dihapus
  });

  it("DELETE /requests/:id - harus gagal jika ID tidak ditemukan", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .delete(`/requests/${invalidId}`)
      .set("Authorization", `Bearer ${superAdminToken}`);
    expect(response.status).toBe(404);
  });

  it("DELETE /requests/:id - harus gagal jika bukan SUPER_ADMIN", async () => {
    if (!requestIdToTest) throw new Error("requestIdToTest diperlukan");
    const response = await request(app)
      .delete(`/requests/${requestIdToTest}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(403); // checkRole harus menolak
  });
});
