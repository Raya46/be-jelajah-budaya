const requestSchema = {
    RequestAdminDaerah: {
      type: "object",
      required: ["userId", "daerahId"],
      properties: {
        id: {
          type: "integer",
          description: "ID request",
        },
        namaDaerah: {
          type: "string",
          description: "Nama daerah yang diminta",
        },
        status: {
          type: "string",
          enum: ["ACCEPT", "PENDING", "REJECT"],
          description: "Status request",
        },
        userId: {
          type: "integer",
          description: "ID pengguna yang membuat request",
        },
        daerahId: {
          type: "integer",
          description: "ID daerah yang diminta",
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
  
  export default requestSchema;