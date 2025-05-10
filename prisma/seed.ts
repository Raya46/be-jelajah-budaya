import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const superAdminPassword = await bcrypt.hash("superadmin123", 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@example.com" },
    update: {},
    create: {
      email: "superadmin@example.com",
      username: "superadmin",
      password: superAdminPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  const userPassword = await bcrypt.hash("user123", 10);
  const regularUser = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      username: "regularuser",
      password: userPassword,
      role: Role.USER,
    },
  });

  const adminDaerahPassword = await bcrypt.hash("admin123", 10);
  const adminDaerahUser = await prisma.user.upsert({
    where: { email: "admin.denpasar@example.com" },
    update: {},
    create: {
      email: "admin.denpasar@example.com",
      username: "admin_denpasar",
      password: adminDaerahPassword,
      alamat: "Jl. Admin Denpasar",
      role: Role.ADMIN_DAERAH,
    },
  });

  const bali = await prisma.provinsi.upsert({
    where: { id: 1 },
    update: { nama: "Bali", gambar: "https://example.com/bali.jpg" },
    create: {
      id: 1,
      nama: "Bali",
      gambar: "https://example.com/bali.jpg",
    },
  });

  const jawaTimur = await prisma.provinsi.upsert({
    where: { id: 2 },
    update: { nama: "Jawa Timur", gambar: "https://example.com/jatim.jpg" },
    create: {
      id: 2,
      nama: "Jawa Timur",
      gambar: "https://example.com/jatim.jpg",
    },
  });

  const yogyakarta = await prisma.provinsi.upsert({
    where: { id: 3 },
    update: { nama: "Yogyakarta", gambar: "https://example.com/jogja.jpg" },
    create: {
      id: 3,
      nama: "Yogyakarta",
      gambar: "https://example.com/jogja.jpg",
    },
  });

  const denpasar = await prisma.daerah.upsert({
    where: { id: 1 },
    update: {
      nama: "Denpasar",
      gambar: "https://example.com/denpasar.jpg",
      provinsiId: bali.id,
    },
    create: {
      id: 1,
      nama: "Denpasar",
      gambar: "https://example.com/denpasar.jpg",
      provinsiId: bali.id,
    },
  });

  const surabaya = await prisma.daerah.upsert({
    where: { id: 2 },
    update: {
      nama: "Surabaya",
      gambar: "https://example.com/surabaya.jpg",
      provinsiId: jawaTimur.id,
    },
    create: {
      id: 2,
      nama: "Surabaya",
      gambar: "https://example.com/surabaya.jpg",
      provinsiId: jawaTimur.id,
    },
  });

  const yogyakartaKota = await prisma.daerah.upsert({
    where: { id: 3 },
    update: {
      nama: "Yogyakarta Kota",
      gambar: "https://example.com/yogyakarta.jpg",
      provinsiId: yogyakarta.id,
    },
    create: {
      id: 3,
      nama: "Yogyakarta Kota",
      gambar: "https://example.com/yogyakarta.jpg",
      provinsiId: yogyakarta.id,
    },
  });
  const existingRequest = await prisma.requestAdminDaerah.findFirst({
    where: { userId: adminDaerahUser.id, daerahId: denpasar.id },
  });

  let adminRequest;
  if (!existingRequest) {
    adminRequest = await prisma.requestAdminDaerah.create({
      data: {
        userId: adminDaerahUser.id,
        daerahId: denpasar.id,
        status: "PENDING",
      },
    });
    console.log("Created new admin request:", adminRequest);
  } else {
    adminRequest = existingRequest;
    console.log("Admin request already exists:", adminRequest);
  }
  await prisma.budaya.upsert({
    where: { id: 1 },
    update: {
      nama: "Tari Kecak",
      deskripsi: "Tari Kecak adalah tarian tradisional dari Bali",
      gambar: "https://example.com/kecak.jpg",
      typeBudaya: "TARIAN",
      daerahId: denpasar.id,
    },
    create: {
      id: 1,
      nama: "Tari Kecak",
      deskripsi: "Tari Kecak adalah tarian tradisional dari Bali",
      gambar: "https://example.com/kecak.jpg",
      typeBudaya: "TARIAN",
      daerahId: denpasar.id,
    },
  });
  await prisma.budaya.upsert({
    where: { id: 2 },
    update: {
      nama: "Reog Ponorogo",
      deskripsi: "Reog adalah tarian tradisional dari Jawa Timur",
      gambar: "https://example.com/reog.jpg",
      typeBudaya: "TARIAN",
      daerahId: surabaya.id,
    },
    create: {
      id: 2,
      nama: "Reog Ponorogo",
      deskripsi: "Reog adalah tarian tradisional dari Jawa Timur",
      gambar: "https://example.com/reog.jpg",
      typeBudaya: "TARIAN",
      daerahId: surabaya.id,
    },
  });
  await prisma.budaya.upsert({
    where: { id: 3 },
    update: {
      nama: "Gudeg Yogyakarta",
      deskripsi: "Gudeg Yogyakarta adalah makanan khas dari Yogyakarta",
      gambar: "https://example.com/gudeg.jpg",
      typeBudaya: "MAKANAN",
      daerahId: yogyakartaKota.id,
    },
    create: {
      id: 3,
      nama: "Gudeg Yogyakarta",
      deskripsi: "Gudeg Yogyakarta adalah makanan khas dari Yogyakarta",
      gambar: "https://example.com/gudeg.jpg",
      typeBudaya: "MAKANAN",
      daerahId: yogyakartaKota.id,
    },
  });

  const eventBali = await prisma.event.upsert({
    where: { id: 1 },
    update: {
      nama: "Festival Budaya Bali",
      deskripsi: "Festival tahunan budaya Bali",
      gambar: "https://example.com/festival-bali.jpg",
      tanggal: new Date("2024-06-15"),
      lokasi: "Denpasar",
      daerahId: denpasar.id,
    },
    create: {
      id: 1,
      nama: "Festival Budaya Bali",
      deskripsi: "Festival tahunan budaya Bali",
      gambar: "https://example.com/festival-bali.jpg",
      tanggal: new Date("2024-06-15"),
      lokasi: "Denpasar",
      daerahId: denpasar.id,
    },
  });

  const existingRating = await prisma.userEventRating.findFirst({
    where: { userId: regularUser.id, eventId: eventBali.id },
  });

  if (!existingRating) {
    await prisma.userEventRating.create({
      data: {
        userId: regularUser.id,
        eventId: eventBali.id,
        rating: 5,
        review: "Sangat Menarik! (seeded)",
      },
    });
    console.log("Created new user event rating.");
  } else {
    console.log("User event rating already exists.");
  }

  console.log("Seeding finished.");
  console.log({
    superAdmin,
    regularUser,
    adminDaerahUser,
    bali,
    denpasar,
    adminRequest,
  });
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
