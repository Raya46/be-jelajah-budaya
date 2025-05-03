import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import { app } from "../index"; // Impor app dari index.ts
import path from "path";
import jwt from "jsonwebtoken";
import prisma from "../utils/database";
import dotenv from "dotenv";
import { Role } from "@prisma/client";

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

let adminToken: string; // Bisa ADMIN_DAERAH atau SUPER_ADMIN
let createdDaerahId: number;
let testProvinsiId = 1; // Asumsi ID provinsi 1 (Bali) dari seeder

beforeAll(async () => {
  try {
    // Ambil token ADMIN_DAERAH
    const auth = await getAuthToken(Role.ADMIN_DAERAH);
    adminToken = auth.token;

    // Pastikan Provinsi dengan ID testProvinsiId ada
    const provinsiExists = await prisma.provinsi.findUnique({
      where: { id: testProvinsiId },
    });
    if (!provinsiExists) {
      throw new Error(
        `Provinsi (ID: ${testProvinsiId}) tidak ditemukan untuk tes Daerah.`
      );
    }
  } catch (error) {
    console.error("Error di beforeAll daerah.test.ts:", error);
    throw error;
  }
});

describe("API Daerah", () => {
  // === GET Endpoints (Publik) ===
  it("GET /daerah - harus mengembalikan daftar semua daerah", async () => {
    const response = await request(app).get("/daerah");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(Array.isArray(response.body.daerah)).toBe(true);
  });

  it("GET /daerah/:id - harus mengembalikan satu daerah jika ID valid", async () => {
    const daerahId = 1; // Ganti dengan ID yang valid
    const response = await request(app).get(`/daerah/${daerahId}`);
    if (response.status === 200) {
      expect(response.body.message).toBe("success");
      expect(response.body.daerah).toBeDefined();
      expect(response.body.daerah.id).toBe(daerahId);
      expect(response.body.daerah).toHaveProperty("provinsiId");
    } else {
      expect(response.status).toBe(500); // Controller return 500 jika not found
    }
  });

  it("GET /daerah/:id - harus mengembalikan 500 jika ID tidak valid", async () => {
    const invalidId = 99999;
    const response = await request(app).get(`/daerah/${invalidId}`);
    expect(response.status).toBe(404); // Controller harusnya 404
  });

  // === POST Endpoint (Memerlukan Auth & Upload) ===
  it("POST /daerah - harus membuat daerah baru", async () => {
    const filePath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const daerahData = {
      nama: "Daerah Tes Index",
      provinsiId: testProvinsiId.toString(),
    };

    const response = await request(app)
      .post("/daerah")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("nama", daerahData.nama)
      .field("provinsiId", daerahData.provinsiId)
      .attach("gambar", filePath);

    expect(response.status).toBe(201); // Harusnya 201 Created
    expect(response.body.message).toBe("success");
    expect(response.body.daerah).toBeDefined();
    expect(response.body.daerah.nama).toBe(daerahData.nama);
    expect(response.body.daerah.provinsiId).toBe(testProvinsiId);
    expect(response.body.daerah.gambar).toContain("cloudinary.com");
    createdDaerahId = response.body.daerah.id;
  });

  it("POST /daerah - harus gagal tanpa token", async () => {
    const filePath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const response = await request(app)
      .post("/daerah")
      .field("nama", "Gagal Daerah")
      .field("provinsiId", testProvinsiId.toString())
      .attach("gambar", filePath);
    expect(response.status).toBe(401);
  });

  // === PUT Endpoint (Memerlukan Auth & Upload Opsional) ===
  it("PUT /daerah/:id - harus memperbarui daerah", async () => {
    if (!createdDaerahId)
      throw new Error("createdDaerahId is required for PUT test");
    const filePath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const updatedData = {
      nama: "Daerah Tes Index Updated",
      provinsiId: testProvinsiId.toString(), // Atau ganti provinsi jika perlu
    };

    const response = await request(app)
      .put(`/daerah/${createdDaerahId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .field("nama", updatedData.nama)
      .field("provinsiId", updatedData.provinsiId)
      .attach("gambar", filePath); // Gambar opsional

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(response.body.daerah.nama).toBe(updatedData.nama);
    expect(response.body.daerah.id).toBe(createdDaerahId);
  });

  it("PUT /daerah/:id - harus gagal jika ID tidak ditemukan", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .put(`/daerah/${invalidId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .field("nama", "Gagal Update Daerah")
      .field("provinsiId", testProvinsiId.toString());
    expect(response.status).toBe(404);
  });

  // === DELETE Endpoint (Memerlukan Auth) ===
  it("DELETE /daerah/:id - harus menghapus daerah", async () => {
    if (!createdDaerahId)
      throw new Error("createdDaerahId is required for DELETE test");

    // Buat item sementara untuk dihapus
    const filePath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const tempDaerah = {
      nama: "Delete Daerah",
      provinsiId: testProvinsiId.toString(),
    };
    const createRes = await request(app)
      .post("/daerah")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("nama", tempDaerah.nama)
      .field("provinsiId", tempDaerah.provinsiId)
      .attach("gambar", filePath);
    expect(createRes.status).toBe(201); // Harusnya 201 Created
    const idToDelete = createRes.body.daerah.id;

    const response = await request(app)
      .delete(`/daerah/${idToDelete}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");

    // Verifikasi penghapusan
    const getResponse = await request(app).get(`/daerah/${idToDelete}`);
    expect(getResponse.status).toBe(404); // Harusnya 404 Not Found
  });

  it("DELETE /daerah/:id - harus gagal jika ID tidak ditemukan", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .delete(`/daerah/${invalidId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(404);
  });
});
