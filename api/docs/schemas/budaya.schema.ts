const budayaSchema = {
    Budaya: {
      type: "object",
      required: ["nama", "deskripsi", "daerahId"],
      properties: {
        id: {
          type: "integer",
          description: "ID budaya",
        },
        nama: {
          type: "string",
          description: "Nama budaya",
        },
        deskripsi: {
          type: "string",
          description: "Deskripsi budaya",
        },
        gambar: {
          type: "string",
          description: "URL gambar budaya (opsional)",
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
  
  export default budayaSchema;