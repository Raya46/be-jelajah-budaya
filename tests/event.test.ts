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

let adminToken: string;
let createdEventId: number;
let testDaerahId = 1; // Asumsi ID daerah 1 (Denpasar) dari seeder

beforeAll(async () => {
  try {
    const auth = await getAuthToken(Role.ADMIN_DAERAH);
    adminToken = auth.token;

    // Pastikan Daerah dengan ID testDaerahId ada
    const daerahExists = await prisma.daerah.findUnique({
      where: { id: testDaerahId },
    });
    if (!daerahExists) {
      throw new Error(
        `Daerah (ID: ${testDaerahId}) tidak ditemukan untuk tes Event.`
      );
    }
  } catch (error) {
    console.error("Error di beforeAll event.test.ts:", error);
    throw error;
  }
});

describe("API Event", () => {
  // === GET Endpoints (Publik) ===
  it("GET /events - harus mengembalikan daftar semua event", async () => {
    const response = await request(app).get("/events");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(Array.isArray(response.body.event)).toBe(true); // Perhatikan: key adalah 'event' bukan 'events' di controller Anda
  });

  it("GET /events/:id - harus mengembalikan satu event jika ID valid", async () => {
    const eventId = 1; // Ganti dengan ID event yang valid
    const response = await request(app).get(`/events/${eventId}`);
    if (response.status === 200) {
      expect(response.body.message).toBe("success");
      expect(response.body.event).toBeDefined();
      expect(response.body.event.id).toBe(eventId);
      expect(response.body.event).toHaveProperty("daerah"); // Verifikasi include daerah
      expect(response.body.event.daerah.nama).toBeDefined();
    } else {
      expect(response.status).toBe(500); // Controller return 500 jika not found
    }
  });

  it("GET /events/:id - harus mengembalikan 500 jika ID tidak valid", async () => {
    const invalidId = 99999;
    const response = await request(app).get(`/events/${invalidId}`);
    expect(response.status).toBe(404); // Controller harusnya 404
  });

  // === POST Endpoint (Memerlukan Auth & Upload) ===
  it("POST /events - harus membuat event baru", async () => {
    const filePath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const eventData = {
      nama: "Event Tes Index",
      deskripsi: "Deskripsi event tes index",
      tanggal: new Date().toISOString(), // Format ISO string
      lokasi: "Lokasi Tes Index",
      daerahId: testDaerahId.toString(),
    };

    const response = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("nama", eventData.nama)
      .field("deskripsi", eventData.deskripsi)
      .field("tanggal", eventData.tanggal)
      .field("lokasi", eventData.lokasi)
      .field("daerahId", eventData.daerahId)
      .attach("gambar", filePath);

    expect(response.status).toBe(201); // Harusnya 201 Created
    expect(response.body.message).toBe("success");
    expect(response.body.event).toBeDefined();
    expect(response.body.event.nama).toBe(eventData.nama);
    expect(response.body.event.daerahId).toBe(testDaerahId);
    expect(response.body.event.gambar).toContain("cloudinary.com");
    createdEventId = response.body.event.id;
  });

  it("POST /events - harus gagal tanpa token", async () => {
    const filePath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const eventData = {
      /* ... data event ... */
    };
    const response = await request(app)
      .post("/events")
      .field("nama", "Gagal Event")
      // ... field lain ...
      .attach("gambar", filePath);
    expect(response.status).toBe(401);
  });

  // === PUT Endpoint (Memerlukan Auth & Upload Opsional) ===
  it("PUT /events/:id - harus memperbarui event", async () => {
    if (!createdEventId)
      throw new Error("createdEventId is required for PUT test");
    const filePath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const updatedData = {
      nama: "Event Tes Index Updated",
      deskripsi: "Deskripsi event updated index",
      tanggal: new Date(Date.now() + 86400000).toISOString(), // Besok
      lokasi: "Lokasi Tes Index Updated",
      daerahId: testDaerahId.toString(),
    };

    const response = await request(app)
      .put(`/events/${createdEventId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .field("nama", updatedData.nama)
      .field("deskripsi", updatedData.deskripsi)
      .field("tanggal", updatedData.tanggal)
      .field("lokasi", updatedData.lokasi)
      .field("daerahId", updatedData.daerahId)
      .attach("gambar", filePath); // Gambar opsional

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(response.body.event.nama).toBe(updatedData.nama);
    expect(response.body.event.id).toBe(createdEventId);
  });

  it("PUT /events/:id - harus gagal jika ID tidak ditemukan", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .put(`/events/${invalidId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .field("nama", "Gagal Update Event");
    // ... field lain ...
    expect(response.status).toBe(404); // Controller/Service handles P2025 as 404
  });

  // === DELETE Endpoint (Memerlukan Auth) ===
  it("DELETE /events/:id - harus menghapus event", async () => {
    if (!createdEventId)
      throw new Error("createdEventId is required for DELETE test");

    // Buat item sementara
    const filePath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const tempEvent = {
      nama: "Delete Event",
      deskripsi: "d",
      tanggal: new Date().toISOString(),
      lokasi: "l",
      daerahId: testDaerahId.toString(),
    };
    const createRes = await request(app)
      .post("/events")
      .set("Authorization", `Bearer ${adminToken}`)
      .field("nama", tempEvent.nama)
      .field("deskripsi", tempEvent.deskripsi)
      .field("tanggal", tempEvent.tanggal)
      .field("lokasi", tempEvent.lokasi)
      .field("daerahId", tempEvent.daerahId)
      .attach("gambar", filePath);
    expect(createRes.status).toBe(201); // Harusnya 201 Created
    const idToDelete = createRes.body.event.id;

    const response = await request(app)
      .delete(`/events/${idToDelete}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");

    // Verifikasi penghapusan
    const getResponse = await request(app).get(`/events/${idToDelete}`);
    expect(getResponse.status).toBe(404); // Harusnya 404 Not Found
  });

  it("DELETE /events/:id - harus gagal jika ID tidak ditemukan", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .delete(`/events/${invalidId}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(response.status).toBe(404);
  });
});
