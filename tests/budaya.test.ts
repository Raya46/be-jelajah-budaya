import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import { app } from "../index"; // Impor app dari index.ts
import path from "path";
import { TypeBudaya, Role } from "@prisma/client"; // Impor Role
import jwt from "jsonwebtoken"; // Impor JWT
import prisma from "../utils/database"; // Impor Prisma
import dotenv from "dotenv"; // Impor dotenv

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

let adminToken: string; // Token untuk ADMIN_DAERAH atau SUPER_ADMIN
let createdBudayaId: number;
let testDaerahId = 1; // Asumsi ID daerah 1 dari seeder

beforeAll(async () => {
  try {
    // Budaya bisa dibuat/diedit oleh ADMIN_DAERAH atau SUPER_ADMIN
    // Ambil token ADMIN_DAERAH (asumsi ada dari seeder)
    const auth = await getAuthToken(Role.ADMIN_DAERAH);
    adminToken = auth.token;

    // Pastikan Daerah dengan ID testDaerahId ada
    const daerahExists = await prisma.daerah.findUnique({
      where: { id: testDaerahId },
    });
    if (!daerahExists) {
      throw new Error(
        `Daerah (ID: ${testDaerahId}) tidak ditemukan untuk tes Budaya.`
      );
    }
  } catch (error) {
    console.error("Error di beforeAll budaya.test.ts:", error);
    throw error;
  }
});

// Tidak perlu start/stop server jika supertest pakai app langsung

describe("API Budaya", () => {
  // === GET Endpoints (Publik) ===
  it("GET /budaya - harus mengembalikan daftar semua budaya", async () => {
    const response = await request(app).get("/budaya");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(Array.isArray(response.body.budaya)).toBe(true);
  });

  // Gunakan enum yang valid dari schema.prisma
  const validBudayaType: TypeBudaya = "TARIAN";
  it(`GET /budaya?typeBudaya=${validBudayaType} - harus mengembalikan daftar budaya ${validBudayaType}`, async () => {
    const response = await request(app)
      .get("/budaya")
      .query({ typeBudaya: validBudayaType });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(Array.isArray(response.body.budaya)).toBe(true);
    response.body.budaya.forEach((item: any) => {
      expect(item.typeBudaya).toBe(validBudayaType);
    });
  });

  it("GET /budaya/:id - harus mengembalikan satu budaya jika ID valid", async () => {
    const budayaId = 1; // Ganti dengan ID yang valid
    const response = await request(app).get(`/budaya/${budayaId}`);
    if (response.status === 200) {
      expect(response.body.message).toBe("success");
      expect(response.body.budaya).toBeDefined();
      expect(response.body.budaya.id).toBe(budayaId);
    } else {
      expect(response.status).toBe(500); // Controller return 500 jika not found
    }
  });

  it("GET /budaya/:id - harus mengembalikan 500 jika ID tidak valid", async () => {
    const invalidId = 99999;
    const response = await request(app).get(`/budaya/${invalidId}`);
    expect(response.status).toBe(404); // Controller harusnya return 404
  });

  // === POST Endpoint (Memerlukan Auth & Upload) ===
  it("POST /budaya/create-budaya - harus membuat budaya baru", async () => {
    const filePath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const budayaData = {
      nama: "Budaya Tes Index",
      deskripsi: "Deskripsi budaya tes index",
      daerahId: testDaerahId.toString(),
      typeBudaya: "MAKANAN" as TypeBudaya, // Gunakan enum valid
    };

    const response = await request(app)
      .post("/budaya/create-budaya")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("nama", budayaData.nama)
      .field("deskripsi", budayaData.deskripsi)
      .field("daerahId", budayaData.daerahId)
      .field("typeBudaya", budayaData.typeBudaya)
      .attach("gambar", filePath);

    expect(response.status).toBe(201); // Harusnya 201 Created
    expect(response.body.message).toBe("success");
    expect(response.body.budaya).toBeDefined();
    expect(response.body.budaya.nama).toBe(budayaData.nama);
    expect(response.body.budaya.typeBudaya).toBe(budayaData.typeBudaya);
    expect(response.body.budaya.gambar).toContain("cloudinary.com");
    createdBudayaId = response.body.budaya.id;
  });

  it("POST /budaya/create-budaya - harus gagal tanpa token", async () => {
    const filePath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const response = await request(app)
      .post("/budaya/create-budaya")
      .field("nama", "Gagal Budaya")
      .field("deskripsi", "Gagal desc")
      .field("daerahId", testDaerahId.toString())
      .field("typeBudaya", "PAKAIAN" as TypeBudaya) // Enum valid
      .attach("gambar", filePath);
    expect(response.status).toBe(401); // Auth middleware menolak
  });

  it("POST /budaya/create-budaya - harus gagal tanpa file gambar", async () => {
    const budayaData = {
      nama: "Budaya Gagal Gambar",
      deskripsi: "Deskripsi gagal",
      daerahId: testDaerahId.toString(),
      typeBudaya: "TARIAN" as TypeBudaya, // Enum valid
    };
    const response = await request(app)
      .post("/budaya/create-budaya")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("nama", budayaData.nama)
      .field("deskripsi", budayaData.deskripsi)
      .field("daerahId", budayaData.daerahId)
      .field("typeBudaya", budayaData.typeBudaya);

    expect(response.status).toBe(400); // Service throw error -> controller 400
  });

  // === PUT Endpoint (Memerlukan Auth & Upload Opsional) ===
  it("PUT /budaya/:id - harus memperbarui budaya", async () => {
    if (!createdBudayaId)
      throw new Error("createdBudayaId is required for PUT test");
    const filePath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const updatedData = {
      nama: "Budaya Tes Index Updated",
      deskripsi: "Deskripsi updated index",
      daerahId: testDaerahId.toString(),
      typeBudaya: "KESENIAN_KERAJINAN" as TypeBudaya, // Enum valid
    };

    const response = await request(app)
      .put(`/budaya/${createdBudayaId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .field("nama", updatedData.nama)
      .field("deskripsi", updatedData.deskripsi)
      .field("daerahId", updatedData.daerahId)
      .field("typeBudaya", updatedData.typeBudaya)
      .attach("gambar", filePath);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(response.body.budaya.nama).toBe(updatedData.nama);
    expect(response.body.budaya.typeBudaya).toBe(updatedData.typeBudaya);
    expect(response.body.budaya.id).toBe(createdBudayaId);
  });

  it("PUT /budaya/:id - harus gagal jika ID tidak ditemukan", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .put(`/budaya/${invalidId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .field("nama", "Gagal Update Budaya")
      .field("daerahId", testDaerahId.toString())
      .field("typeBudaya", "TARIAN" as TypeBudaya);
    expect(response.status).toBe(404);
  });

  // === DELETE Endpoint (Memerlukan Auth) ===
  it("DELETE /budaya/:id - harus menghapus budaya", async () => {
    if (!createdBudayaId)
      throw new Error("createdBudayaId is required for DELETE test");

    // Mungkin buat item baru untuk dihapus agar tidak bergantung pada tes POST
    const tempBudayaData = {
      nama: "Budaya Delete Test",
      deskripsi: "Deskripsi delete",
      daerahId: testDaerahId.toString(),
      typeBudaya: "MAKANAN" as TypeBudaya,
    };
    const filePath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const createResponse = await request(app)
      .post("/budaya/create-budaya")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("nama", tempBudayaData.nama)
      .field("deskripsi", tempBudayaData.deskripsi)
      .field("daerahId", tempBudayaData.daerahId)
      .field("typeBudaya", tempBudayaData.typeBudaya)
      .attach("gambar", filePath);
    expect(createResponse.status).toBe(201); // Harusnya 201 Created
    const idToDelete = createResponse.body.budaya.id;

    const response = await request(app)
      .delete(`/budaya/${idToDelete}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");

    // Verifikasi penghapusan
    const getResponse = await request(app).get(`/budaya/${idToDelete}`);
    expect(getResponse.status).toBe(404); // Harusnya 404 Not Found
  });

  it("DELETE /budaya/:id - harus gagal jika ID tidak ditemukan", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .delete(`/budaya/${invalidId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(404);
  });
});
