const provinsiSchema = {
  Provinsi: {
    type: "object",
    required: ["nama"],
    properties: {
      id: {
        type: "integer",
        description: "ID provinsi",
      },
      nama: {
        type: "string",
        description: "Nama provinsi",
      },
      gambar: {
        type: "string",
        description: "File gambar provinsi (opsional)",
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

export default provinsiSchema;