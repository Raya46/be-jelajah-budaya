import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create Super Admin
  const hashedPassword = await bcrypt.hash('superadmin123', 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@example.com' },
    update: {},
    create: {
      email: 'superadmin@example.com',
      username: 'superadmin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  // Create Provinsi satu per satu untuk mendapatkan ID yang benar
  const bali = await prisma.provinsi.create({
    data: {
      nama: 'Bali',
      gambar: 'https://example.com/bali.jpg',
    },
  });

  const jawaTimur = await prisma.provinsi.create({
    data: {
      nama: 'Jawa Timur',
      gambar: 'https://example.com/jatim.jpg',
    },
  });

  const yogyakarta = await prisma.provinsi.create({
    data: {
      nama: 'Yogyakarta',
      gambar: 'https://example.com/jogja.jpg',
    },
  });

  // Create Daerah dengan menggunakan ID provinsi yang sudah dibuat
  const denpasar = await prisma.daerah.create({
    data: {
      nama: 'Denpasar',
      gambar: 'https://example.com/denpasar.jpg',
      provinsiId: bali.id,
    },
  });

  const surabaya = await prisma.daerah.create({
    data: {
      nama: 'Surabaya',
      gambar: 'https://example.com/surabaya.jpg',
      provinsiId: jawaTimur.id,
    },
  });

  const yogyakartaKota = await prisma.daerah.create({
    data: {
      nama: 'Yogyakarta Kota',
      gambar: 'https://example.com/yogyakarta.jpg',
      provinsiId: yogyakarta.id,
    },
  });

  // Create Budaya
  const budaya = await prisma.budaya.createMany({
    data: [
      {
        nama: 'Tari Kecak',
        deskripsi: 'Tari Kecak adalah tarian tradisional dari Bali',
        gambar: 'https://example.com/kecak.jpg',
        daerahId: denpasar.id,
      },
      {
        nama: 'Reog Ponorogo',
        deskripsi: 'Reog adalah tarian tradisional dari Jawa Timur',
        gambar: 'https://example.com/reog.jpg',
        daerahId: surabaya.id,
      },
      {
        nama: 'Keraton Yogyakarta',
        deskripsi: 'Keraton Yogyakarta adalah istana Sultan Yogyakarta',
        gambar: 'https://example.com/keraton.jpg',
        daerahId: yogyakartaKota.id,
      },
    ],
    skipDuplicates: true,
  });

  // Create Events
  const events = await prisma.event.createMany({
    data: [
      {
        nama: 'Festival Budaya Bali',
        deskripsi: 'Festival tahunan budaya Bali',
        gambar: 'https://example.com/festival-bali.jpg',
        tanggal: new Date('2024-06-15'),
        lokasi: 'Denpasar',
        daerahId: denpasar.id,
      },
      {
        nama: 'Festival Reog',
        deskripsi: 'Festival tahunan Reog Ponorogo',
        gambar: 'https://example.com/festival-reog.jpg',
        tanggal: new Date('2024-07-20'),
        lokasi: 'Surabaya',
        daerahId: surabaya.id,
      },
      {
        nama: 'Festival Keraton',
        deskripsi: 'Festival budaya Keraton Yogyakarta',
        gambar: 'https://example.com/festival-keraton.jpg',
        tanggal: new Date('2024-08-25'),
        lokasi: 'Yogyakarta',
        daerahId: yogyakartaKota.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log({
    superAdmin,
    provinsi: { bali, jawaTimur, yogyakarta },
    daerah: { denpasar, surabaya, yogyakartaKota },
    budaya,
    events
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });