export interface EventUpdateData {
  nama?: string;
  deskripsi?: string;
  tanggal?: Date;
  lokasi?: string;
  gambar?: string;
  daerah?: { connect: { id: number } };
}
