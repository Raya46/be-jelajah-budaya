const eventSchema = {
    Event: {
      type: "object",
      required: ["nama", "deskripsi", "tanggal", "lokasi", "daerahId"],
      properties: {
        id: {
          type: "integer",
          description: "ID event",
        },
        nama: {
          type: "string",
          description: "Nama event",
        },
        deskripsi: {
          type: "string",
          description: "Deskripsi event",
        },
        gambar: {
          type: "string",
          description: "URL gambar event (opsional)",
        },
        tanggal: {
          type: "string",
          format: "date-time",
          description: "Tanggal event",
        },
        lokasi: {
          type: "string",
          description: "Lokasi event",
        },
        daerahId: {
          type: "integer",
          description: "ID daerah yang terkait",
        },
        createdAt: {
          type: "string",
          format: "date-time",
          description: "Waktu pembuatan",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
          description: "Waktu update terakhir",
        },
      },
    },
    Error: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "Pesan error",
        },
        error: {
          type: "string",
          description: "Detail error",
        },
      },
    },
  };
  
  export default eventSchema;