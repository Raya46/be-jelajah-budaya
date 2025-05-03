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

let superAdminToken: string;
let adminDaerahToken: string;
let userToken: string;
let testUserId: number; // ID user biasa dari seeder
let testAdminId: number; // ID admin daerah dari seeder
let testDaerahId = 1; // Asumsi ID daerah 1 (Denpasar) dari seeder

beforeAll(async () => {
  try {
    const superAdminAuth = await getAuthToken(Role.SUPER_ADMIN);
    superAdminToken = superAdminAuth.token;

    const adminAuth = await getAuthToken(Role.ADMIN_DAERAH);
    adminDaerahToken = adminAuth.token;
    testAdminId = adminAuth.userId;

    const userAuth = await getAuthToken(Role.USER);
    userToken = userAuth.token;
    testUserId = userAuth.userId;

    // Pastikan daerah ada
    const daerahExists = await prisma.daerah.findUnique({
      where: { id: testDaerahId },
    });
    if (!daerahExists) {
      throw new Error(
        `Daerah (ID: ${testDaerahId}) tidak ditemukan untuk tes User.`
      );
    }
  } catch (error) {
    console.error("Error di beforeAll user.test.ts:", error);
    throw error;
  }
});

describe("API User", () => {
  // === Registrasi & Login (Publik) ===
  const testUserEmail = `testuser_${Date.now()}@example.com`;
  const testUserPassword = "password123";

  it("POST /users/register-user - harus mendaftarkan user baru", async () => {
    const response = await request(app) // Gunakan app
      .post("/users/register-user")
      .send({
        username: "Test User Bun Index",
        email: testUserEmail,
        password: testUserPassword,
      });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("User berhasil dibuat");
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(testUserEmail);
    expect(response.body.user.role).toBe("USER");
    testUserId = response.body.user.id;
  });

  it("POST /users/login - harus login user yang sudah terdaftar", async () => {
    expect(testUserId).toBeDefined(); // Pastikan user sudah dibuat
    const response = await request(app) // Gunakan app
      .post("/users/login")
      .send({ email: testUserEmail, password: testUserPassword });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Login berhasil");
    expect(response.body.token).toBeDefined();
    expect(response.body.user.id).toBe(testUserId);
    userToken = response.body.token; // Simpan tokennya
  });

  it("POST /users/login - harus gagal dengan password salah", async () => {
    const response = await request(app) // Gunakan app
      .post("/users/login")
      .send({ email: testUserEmail, password: "wrongpassword" });
    expect([400, 401, 500]).toContain(response.status); // Sesuai controller Anda
  });

  const testAdminEmail = `testadmin_${Date.now()}@example.com`;
  it("POST /users/register-admin - harus mendaftarkan admin daerah baru", async () => {
    const ktpPath = path.resolve(__dirname, "fixtures/test-image.jpg");
    const portfolioPath = path.resolve(__dirname, "fixtures/test-image.jpg");

    const response = await request(app) // Gunakan app
      .post("/users/register-admin")
      .field("username", "Test AdminDaerah Index")
      .field("email", testAdminEmail)
      .field("password", testUserPassword)
      .field("alamat", "Jl. Admin Tes Index")
      .field("daerahId", testDaerahId.toString())
      .attach("ktp", ktpPath)
      .attach("portofolio", portfolioPath);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Admin daerah berhasil dibuat");
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(testAdminEmail);
    expect(response.body.user.role).toBe("ADMIN_DAERAH");
    expect(response.body.user.ktp).toContain("cloudinary.com");
    expect(response.body.user.portofolio).toContain("cloudinary.com");
    expect(response.body.requestAdminDaerah).toBeDefined();
    testAdminId = response.body.user.id;
  });

  // === Protected Routes ===

  it("POST /users/create-admin - harus membuat admin daerah (oleh SUPER_ADMIN)", async () => {
    const newAdminEmail = `newadmin_${Date.now()}@test.com`;
    const response = await request(app)
      .post("/users/create-admin")
      .set("Authorization", `Bearer ${superAdminToken}`) // Gunakan token SUPER_ADMIN
      .send({
        username: "new_admin_test",
        email: newAdminEmail,
        password: "password123",
        alamat: "Alamat Created Admin Index",
        daerahId: testDaerahId,
      });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Admin daerah berhasil dibuat");
    expect(response.body.user.email).toBe(newAdminEmail);
    expect(response.body.user.role).toBe(Role.ADMIN_DAERAH);
    // Optional: cleanup user baru?
  });

  it("POST /users/create-admin - harus gagal jika bukan SUPER_ADMIN", async () => {
    const dummyData = {
      /* ... data admin ... */
    };
    const response = await request(app)
      .post("/users/create-admin")
      .set("Authorization", `Bearer ${adminDaerahToken}`) // Gunakan token ADMIN_DAERAH
      .send(dummyData);
    expect(response.status).toBe(403); // checkRole menolak
  });

  it("GET /users - harus mengembalikan semua user (oleh SUPER_ADMIN)", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${superAdminToken}`); // Gunakan token SUPER_ADMIN
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.users)).toBe(true);
  });

  it("GET /users - harus gagal jika bukan SUPER_ADMIN", async () => {
    const response = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminDaerahToken}`); // Gunakan token ADMIN_DAERAH
    expect(response.status).toBe(403); // checkRole menolak
  });

  it("GET /users/regular - harus mengembalikan user biasa (oleh SUPER_ADMIN)", async () => {
    const response = await request(app)
      .get("/users/regular")
      .set("Authorization", `Bearer ${superAdminToken}`); // Gunakan token SUPER_ADMIN
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.users)).toBe(true);
    response.body.users.forEach((user: any) =>
      expect(user.role).toBe(Role.USER)
    );
  });

  it("GET /users/regular - harus mengembalikan user biasa (oleh ADMIN_DAERAH)", async () => {
    const response = await request(app)
      .get("/users/regular")
      .set("Authorization", `Bearer ${adminDaerahToken}`); // Gunakan token ADMIN_DAERAH
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.users)).toBe(true);
  });

  it("GET /users/regular - harus gagal jika USER biasa", async () => {
    const response = await request(app)
      .get("/users/regular")
      .set("Authorization", `Bearer ${userToken}`); // Gunakan token USER
    expect(response.status).toBe(403); // checkRole menolak USER biasa
  });

  it("GET /users/:id - harus mengembalikan detail user (oleh ADMIN_DAERAH)", async () => {
    if (!testUserId) throw new Error("testUserId required"); // Gunakan ID USER biasa
    const response = await request(app)
      .get(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${adminDaerahToken}`); // ADMIN bisa lihat detail USER
    expect(response.status).toBe(200);
    expect(response.body.user.id).toBe(testUserId);
  });

  // Tambah tes: GET /users/:id oleh USER biasa (hanya boleh lihat diri sendiri?)
  it("GET /users/:id - harus mengembalikan detail diri sendiri (oleh User)", async () => {
    if (!testUserId) throw new Error("testUserId required");
    const response = await request(app)
      .get(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(response.status).toBe(200); // Asumsi user boleh lihat diri sendiri
    expect(response.body.user.id).toBe(testUserId);
  });

  it("GET /users/:id - harus GAGAL melihat user lain (oleh User)", async () => {
    if (!testAdminId) throw new Error("testAdminId required");
    const response = await request(app)
      .get(`/users/${testAdminId}`) // Mencoba lihat admin
      .set("Authorization", `Bearer ${userToken}`);
    expect(response.status).toBe(403); // Asumsi tidak boleh
  });

  it("PUT /users/:id - harus update user (oleh ADMIN_DAERAH)", async () => {
    if (!testUserId) throw new Error("testUserId required"); // Update user biasa oleh admin
    const updatedUsername = `updated_user_${Date.now()}`;
    const response = await request(app)
      .put(`/users/${testUserId}`)
      .set("Authorization", `Bearer ${adminDaerahToken}`) // Gunakan token ADMIN_DAERAH
      .send({
        username: updatedUsername,
        alamat: "Alamat Update Tes Index",
      });
    expect(response.status).toBe(200);
    expect(response.body.user.username).toBe(updatedUsername);
    expect(response.body.user.id).toBe(testUserId);
  });

  // Tambah tes: PUT /users/:id gagal jika user biasa update user lain
  // Tambah tes: PUT /users/:id berhasil jika user biasa update diri sendiri

  it("DELETE /users/:id - harus hapus user (oleh ADMIN_DAERAH)", async () => {
    // Buat user baru untuk dihapus
    const userToDeleteEmail = `delete_${Date.now()}@test.com`;
    const regResponse = await request(app).post("/users/register-user").send({
      username: "user_to_delete",
      email: userToDeleteEmail,
      password: "password123",
    });
    expect(regResponse.status).toBe(201);
    const userIdToDelete = regResponse.body.user.id;

    const response = await request(app)
      .delete(`/users/${userIdToDelete}`)
      .set("Authorization", `Bearer ${adminDaerahToken}`); // ADMIN_DAERAH menghapus
    expect(response.status).toBe(200);

    // Verifikasi
    const getResponse = await request(app)
      .get(`/users/${userIdToDelete}`)
      .set("Authorization", `Bearer ${adminDaerahToken}`);
    expect(getResponse.status).toBe(404); // Harusnya not found
  });

  // Tambah tes: DELETE gagal jika user biasa coba hapus user lain
});
