import { describe, it, expect, beforeAll, afterAll } from "bun:test";
import request from "supertest";
import { app } from "../index"; // Impor app dari index.ts
import jwt from "jsonwebtoken";
import prisma from "../utils/database"; // Akses prisma
import dotenv from "dotenv";
import { Role } from "@prisma/client"; // Import Role enum

dotenv.config(); // Load .env

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Fungsi helper token yang valid
const getAuthToken = async (
  role: Role // Gunakan enum Role
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

let userToken: string;
let testUserId: number;
let testEventId = 1; // Asumsi ID event yang valid
let createdParticipationId: number; // ID partisipasi (UserEventRating) yang dibuat

beforeAll(async () => {
  try {
    const userAuth = await getAuthToken(Role.USER);
    userToken = userAuth.token;
    testUserId = userAuth.userId;

    // Pastikan event dengan ID testEventId ada
    const eventForTest = await prisma.event.findUnique({
      where: { id: testEventId },
    });
    if (!eventForTest) {
      console.warn(
        `Event tes (ID: ${testEventId}) tidak ditemukan, mencoba membuat...`
      );
      // Pastikan daerahId yang dirujuk ada
      const daerahExists = await prisma.daerah.findUnique({ where: { id: 1 } });
      if (!daerahExists) {
        throw new Error(
          "Daerah (ID: 1) tidak ditemukan untuk membuat event tes."
        );
      }
      await prisma.event.create({
        data: {
          id: testEventId, // Gunakan ID yang ditentukan
          nama: "Event Tes Otomatis",
          deskripsi: "Event dibuat otomatis untuk tes",
          tanggal: new Date(),
          lokasi: "Lokasi Tes Otomatis",
          daerahId: 1, // Pastikan ini ID daerah yang valid
          // gambar: "path/to/default/image.jpg" // Opsional: gambar default
        },
      });
      console.log(`Event tes (ID: ${testEventId}) berhasil dibuat.`);
    }
  } catch (error) {
    console.error("Error di beforeAll userEventRate.test.ts:", error);
    // Lempar error lagi agar tes gagal jika setup krusial bermasalah
    throw error;
  }
});

describe("API User Event Rating", () => {
  // === Public GET Endpoints ===
  it("GET /event-ratings - harus mengembalikan semua rating/partisipasi", async () => {
    const response = await request(app).get("/event-ratings");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(Array.isArray(response.body.ratings)).toBe(true);
  });

  it("GET /event-ratings/:id - harus mengembalikan satu rating jika ID valid", async () => {
    const ratingId = 1; // Ganti dengan ID UserEventRating yang valid
    const response = await request(app).get(`/event-ratings/${ratingId}`);
    if (response.status === 200) {
      expect(response.body.message).toBe("success");
      expect(response.body.rating).toBeDefined();
      expect(response.body.rating.id).toBe(ratingId);
    } else {
      expect(response.status).toBe(404); // Controller handle 404
    }
  });

  it("GET /event-ratings/event/:eventId - harus mengembalikan rating untuk event tertentu", async () => {
    const response = await request(app).get(
      `/event-ratings/event/${testEventId}`
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(Array.isArray(response.body.ratings)).toBe(true);
    // Verifikasi eventId jika ada data
    response.body.ratings.forEach((r: any) =>
      expect(r.eventId).toBe(testEventId)
    );
  });

  it("GET /event-ratings/event/:eventId/average - harus mengembalikan rata-rata rating event", async () => {
    const response = await request(app).get(
      `/event-ratings/event/${testEventId}/average`
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toHaveProperty("averageRating");
    expect(response.body.data).toHaveProperty("ratingCount");
  });

  // === Auth Required Endpoints ===

  it("POST /event-ratings/join - harus mendaftarkan user ke event (oleh User)", async () => {
    const response = await request(app)
      .post("/event-ratings/join")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ eventId: testEventId });

    // Periksa status, bisa 201 (baru) atau 409 (sudah join)
    expect([201, 409]).toContain(response.status);

    if (response.status === 201) {
      expect(response.body.message).toBe("Berhasil mengikuti event");
      expect(response.body.userEvent).toBeDefined();
      expect(response.body.userEvent.eventId).toBe(testEventId);
      expect(response.body.userEvent.userId).toBe(testUserId);
      createdParticipationId = response.body.userEvent.id;
    } else {
      // Jika 409 (sudah join), coba cari partisipasi yang ada untuk tes selanjutnya
      console.warn(
        "User sudah join event ini, mencari partisipasi yang ada..."
      );
      const existing = await prisma.userEventRating.findFirst({
        where: { userId: testUserId, eventId: testEventId },
      });
      if (!existing)
        throw new Error("Gagal mendapatkan ID partisipasi yang sudah ada.");
      createdParticipationId = existing.id;
    }
  });

  it("POST /event-ratings/join - harus gagal jika event tidak ada", async () => {
    const invalidEventId = 99999;
    const response = await request(app)
      .post("/event-ratings/join")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ eventId: invalidEventId });
    // Seharusnya 404 karena eventId tidak valid (Prisma P2003 di service -> 404 di controller)
    expect(response.status).toBe(404);
  });

  it("GET /event-ratings/user/:userId - harus mengembalikan rating oleh user tertentu (oleh User ybs)", async () => {
    // AuthMiddleware sudah memvalidasi token, tidak perlu cek role eksplisit di sini
    // Endpoint ini secara logis mengembalikan data milik user yang sedang login
    const response = await request(app)
      .get(`/event-ratings/user/${testUserId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("success");
    expect(Array.isArray(response.body.ratings)).toBe(true);
    // Verifikasi userId jika ada data
    response.body.ratings.forEach((r: any) =>
      expect(r.userId).toBe(testUserId)
    );
  });

  // Tambahkan tes: GET /user/:userId oleh user lain (harus gagal 403?)
  // it("GET /event-ratings/user/:userId - harus gagal jika user lain (403)", async () => {
  //   const otherUserId = testUserId + 1; // Asumsi ID user lain
  //   const response = await request(app)
  //     .get(`/event-ratings/user/${otherUserId}`)
  //     .set("Authorization", `Bearer ${userToken}`);
  //   expect(response.status).toBe(403); // Atau 401/404 tergantung implementasi
  // });

  it("PUT /event-ratings/:id/rate - harus menambahkan/update rating dan review (oleh User)", async () => {
    if (!createdParticipationId)
      throw new Error("createdParticipationId diperlukan");
    const ratingData = {
      rating: 5,
      review: "Event sangat bagus!",
    };

    const response = await request(app)
      .put(`/event-ratings/${createdParticipationId}/rate`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(ratingData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Berhasil memberikan rating");
    expect(response.body.rating).toBeDefined();
    expect(response.body.rating.id).toBe(createdParticipationId);
    expect(response.body.rating.rating).toBe(ratingData.rating);
    expect(response.body.rating.review).toBe(ratingData.review);
  });

  it("PUT /event-ratings/:id/rate - harus gagal jika partisipasi ID tidak ada", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .put(`/event-ratings/${invalidId}/rate`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ rating: 4 });
    expect(response.status).toBe(404);
  });

  // Tambahkan tes: PUT /rate oleh user yang tidak join event tsb (harus gagal 403/404?)

  it("DELETE /event-ratings/:id - harus membatalkan partisipasi (oleh User)", async () => {
    if (!createdParticipationId)
      throw new Error("createdParticipationId diperlukan");

    // Pastikan ada partisipasi untuk dihapus (buat jika perlu, antisipasi tes rate mungkin sudah menghapusnya)
    let idToDelete = createdParticipationId;
    const existing = await prisma.userEventRating.findUnique({
      where: { id: idToDelete },
    });
    if (!existing) {
      console.warn(
        "Partisipasi untuk delete tidak ditemukan, mencoba join lagi..."
      );
      const joinRes = await request(app)
        .post("/event-ratings/join")
        .set("Authorization", `Bearer ${userToken}`)
        .send({ eventId: testEventId });
      if (joinRes.status !== 201 && joinRes.status !== 409) {
        throw new Error(
          `Gagal membuat/mendapatkan partisipasi untuk delete: ${joinRes.status} ${joinRes.text}`
        );
      }
      const currentParticipation = await prisma.userEventRating.findFirst({
        where: { userId: testUserId, eventId: testEventId },
      });
      if (!currentParticipation)
        throw new Error("Gagal mendapatkan ID partisipasi baru.");
      idToDelete = currentParticipation.id;
    } else {
      // Pastikan user yang sedang tes adalah pemilik partisipasi
      if (existing.userId !== testUserId) {
        throw new Error("Partisipasi yang ditemukan bukan milik user tes.");
      }
    }

    const response = await request(app)
      .delete(`/event-ratings/${idToDelete}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Berhasil membatalkan keikutsertaan dalam event"
    );

    // Verifikasi penghapusan
    const getResponse = await request(app).get(`/event-ratings/${idToDelete}`);
    expect(getResponse.status).toBe(404); // Harus 404 setelah dihapus
  });

  it("DELETE /event-ratings/:id - harus gagal jika ID tidak ada", async () => {
    const invalidId = 99999;
    const response = await request(app)
      .delete(`/event-ratings/${invalidId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(response.status).toBe(404);
  });

  // Tambahkan tes: DELETE oleh user yang bukan pemilik partisipasi (harus gagal 403?)
});
