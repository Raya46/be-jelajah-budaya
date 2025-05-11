const daerahSchema = {
    Daerah: {
      type: "object",
      required: ["nama", "provinsiId"],
      properties: {
        id: {
          type: "integer",
          description: "ID daerah",
        },
        nama: {
          type: "string",
          description: "Nama daerah",
        },
        gambar: {
          type: "string",
          description: "URL gambar daerah (opsional)",
        },
        provinsiId: {
          type: "integer",
          description: "ID provinsi yang terkait",
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
  
  export default daerahSchema;