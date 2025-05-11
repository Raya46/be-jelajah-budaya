const responses = {
  UnauthorizedError: {
    description: "Akses ditolak - Token tidak valid atau tidak ada",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Error",
        },
      },
    },
  },
  ForbiddenError: {
    description: "Akses ditolak - Tidak memiliki izin yang cukup",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Error",
        },
      },
    },
  },
  NotFoundError: {
    description: "Data tidak ditemukan",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Error",
        },
      },
    },
  },
  ServerError: {
    description: "Server error",
    content: {
      "application/json": {
        schema: {
          $ref: "#/components/schemas/Error",
        },
      },
    },
  },
};

export default responses;
