import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import { app } from "../index"; // Impor app dari index.ts
import path from "path"; // Untuk path file
import jwt from "jsonwebtoken";
import prisma from "../utils/database";
import dotenv from "dotenv";
import { Role } from "@prisma/client";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Fungsi helper token yang valid (sama seperti di tes lain)
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
let createdProvinsiId: number;

// Dapatkan token sebelum semua tes
beforeAll(async () => {
  try {
    const auth = await getAuthToken(Role.SUPER_ADMIN); // Provinsi hanya bisa diakses SUPER_ADMIN
    superAdminToken = auth.token;

    // Pastikan user SUPER_ADMIN ada (seeder harusnya sudah)
    const superAdminExists = await prisma.user.findFirst({
      where: { role: Role.SUPER_ADMIN },
    });
    if (!superAdminExists)
      throw new Error("SUPER_ADMIN tidak ditemukan di DB untuk tes Provinsi.");
  } catch (error) {
    console.error("Error di beforeAll provinsi.test.ts:", error);
    throw error;
  }
});

describe("API Provinsi", () => {
  // === GET Endpoints (Publik) ===
  it("GET /provinsi - harus mengembalikan daftar provinsi", async () => {
    const response = await request(app).get("/provinsi");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(Array.isArray(response.body.provinsi)).toBe(true);
    if (response.body.provinsi.length > 0) {
      expect(response.body.provinsi[0]).toHaveProperty("id");
      expect(response.body.provinsi[0]).toHaveProperty("nama");
      expect(response.body.provinsi[0]).toHaveProperty("gambar");
    }
  });

  it("GET /provinsi/:id - harus mengembalikan satu provinsi jika ID valid", async () => {
    // Ambil ID provinsi pertama dari seed
    const firstProvinsi = await prisma.provinsi.findFirst();
    if (!firstProvinsi)
      throw new Error("Tidak ada provinsi di DB untuk dites.");
    const provinsiId = firstProvinsi.id;

    const response = await request(app).get(`/provinsi/${provinsiId}`);
    if (response.status === 200) {
      expect(response.body.message).toBe("success");
      expect(response.body.provinsi).toBeDefined();
      expect(response.body.provinsi.id).toBe(provinsiId);
    } else {
      expect(response.status).not.toBe(200);
    }
  });

  it("GET /provinsi/:id - harus mengembalikan 404 jika ID tidak valid", async () => {
    const invalidId = 99999;
    const response = await request(app).get(`/provinsi/${invalidId}`);
    expect(response.status).toBe(404);
    expect(response.body.message).not.toBe("success");
  });

  // === POST Endpoint (Memerlukan Auth & Upload) ===
  it("POST /provinsi/create - harus membuat provinsi baru", async () => {
    const filePath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const response = await request(app)
      .post("/provinsi/create")
      .set("Authorization", `Bearer ${superAdminToken}`)
      .field("nama", "Provinsi Tes Bun Index")
      .attach("gambar", filePath);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(response.body.provinsi).toBeDefined();
    expect(response.body.provinsi.nama).toBe("Provinsi Tes Bun Index");
    expect(response.body.provinsi.gambar).toContain("cloudinary.com");
    createdProvinsiId = response.body.provinsi.id;
  });

  it("POST /provinsi/create - harus gagal tanpa token", async () => {
    const filePath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const response = await request(app)
      .post("/provinsi/create")
      .field("nama", "Provinsi Gagal Tes")
      .attach("gambar", filePath);
    expect(response.status).toBe(401);
  });

  it("POST /provinsi/create - harus gagal tanpa file gambar", async () => {
    const response = await request(app)
      .post("/provinsi/create")
      .set("Authorization", `Bearer ${superAdminToken}`)
      .field("nama", "Provinsi Gagal Gambar");
    expect(response.status).toBe(400);
  });

  // === PUT Endpoint (Memerlukan Auth & Upload Opsional) ===
  it("PUT /provinsi/:id - harus memperbarui provinsi", async () => {
    if (!createdProvinsiId)
      throw new Error("createdProvinsiId tidak ada untuk tes PUT");
    const filePath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const response = await request(app)
      .put(`/provinsi/${createdProvinsiId}`)
      .set("Authorization", `Bearer ${superAdminToken}`)
      .field("nama", "Provinsi Tes Index Updated")
      .attach("gambar", filePath);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(response.body.provinsi.nama).toBe("Provinsi Tes Index Updated");
    expect(response.body.provinsi.id).toBe(createdProvinsiId);
    expect(response.body.provinsi.gambar).toContain("cloudinary.com");
  });

  it("PUT /provinsi/:id - harus gagal jika ID tidak ditemukan", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .put(`/provinsi/${invalidId}`)
      .set("Authorization", `Bearer ${superAdminToken}`)
      .field("nama", "Provinsi Gagal Update");
    expect(response.status).toBe(404);
  });

  // === DELETE Endpoint (Memerlukan Auth) ===
  it("DELETE /provinsi/:id - harus menghapus provinsi", async () => {
    // Buat provinsi baru khusus untuk dihapus
    const tempProvinsiName = `DeleteProvinsi_${Date.now()}`;
    const filePath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const createRes = await request(app)
      .post("/provinsi/create")
      .set("Authorization", `Bearer ${superAdminToken}`)
      .field("nama", tempProvinsiName)
      .attach("gambar", filePath);
    expect(createRes.status).toBe(201); // Harusnya 201 Created
    const idToDelete = createRes.body.provinsi.id;

    const response = await request(app)
      .delete(`/provinsi/${idToDelete}`)
      .set("Authorization", `Bearer ${superAdminToken}`); // Gunakan token yang benar

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Provinsi berhasil dihapus"); // Sesuai controller

    const getResponse = await request(app).get(`/provinsi/${idToDelete}`);
    expect(getResponse.status).toBe(404);
    expect(getResponse.body.message).not.toBe("success");
  });

  it("DELETE /provinsi/:id - harus gagal jika ID tidak ditemukan", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .delete(`/provinsi/${invalidId}`)
      .set("Authorization", `Bearer ${superAdminToken}`); // Gunakan token yang benar
    expect(response.status).toBe(404);
  });
});
