const budayaPath = {
  "/budaya": {
    get: {
      summary: "Mendapatkan semua entri Budaya atau filter by type",
      tags: ["Budaya"],
      parameters: [
        {
          in: "query",
          name: "typeBudaya",
          schema: {
            type: "string",
            enum: ["KULINER", "TRADISI", "SENI", "MUSIK", "BAHASA", "LAINNYA"],
          },
          required: false,
          description: "Filter budaya berdasarkan tipe",
        },
      ],
      responses: {
        200: {
          description: "Daftar semua entri Budaya (atau yang difilter)",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "success",
                  },
                  budaya: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Budaya",
                    },
                  },
                },
              },
            },
          },
        },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
    post: {
      summary: "Membuat entri Budaya baru",
      tags: ["Budaya"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: [
                "nama",
                "deskripsi",
                "gambar",
                "daerahId",
                "typeBudaya",
              ],
              properties: {
                nama: {
                  type: "string",
                  example: "Tari Kecak",
                },
                deskripsi: {
                  type: "string",
                  example: "Tari Kecak adalah tarian tradisional Bali.",
                },
                gambar: {
                  type: "string",
                  format: "binary",
                  description: "File gambar Budaya",
                },
                daerahId: {
                  type: "integer",
                  example: 1,
                  description: "ID Daerah terkait",
                },
                typeBudaya: {
                  type: "string",
                  enum: [
                    "KULINER",
                    "TRADISI",
                    "SENI",
                    "MUSIK",
                    "BAHASA",
                    "LAINNYA",
                  ],
                  example: "SENI",
                  description: "Tipe Budaya",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Entri Budaya berhasil dibuat",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Budaya berhasil dibuat",
                  },
                  budaya: {
                    $ref: "#/components/schemas/Budaya",
                  },
                },
              },
            },
          },
        },
        400: { description: "Input tidak valid atau gambar tidak ada" },
        401: {
          $ref: "#/components/responses/UnauthorizedError",
        },
        403: {
          $ref: "#/components/responses/ForbiddenError",
        },
        500: {
          $ref: "#/components/responses/ServerError",
        },
      },
    },
  },
  "/budaya/create-budaya": {
    post: {
      summary: "Membuat entri Budaya baru",
      tags: ["Budaya"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: [
                "nama",
                "deskripsi",
                "gambar",
                "daerahId",
                "typeBudaya",
              ],
              properties: {
                nama: {
                  type: "string",
                  example: "Tari Kecak",
                },
                deskripsi: {
                  type: "string",
                  example: "Tari Kecak adalah tarian tradisional Bali.",
                },
                gambar: {
                  type: "string",
                  format: "binary",
                  description: "File gambar Budaya",
                },
                daerahId: {
                  type: "integer",
                  example: 1,
                  description: "ID Daerah terkait",
                },
                typeBudaya: {
                  type: "string",
                  enum: [
                    "KULINER",
                    "TRADISI",
                    "SENI",
                    "MUSIK",
                    "BAHASA",
                    "LAINNYA",
                  ],
                  example: "SENI",
                  description: "Tipe Budaya",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Entri Budaya berhasil dibuat",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Budaya berhasil dibuat",
                  },
                  budaya: {
                    $ref: "#/components/schemas/Budaya",
                  },
                },
              },
            },
          },
        },
        400: { description: "Input tidak valid atau gambar tidak ada" },
        401: {
          $ref: "#/components/responses/UnauthorizedError",
        },
        403: {
          $ref: "#/components/responses/ForbiddenError",
        },
        500: {
          $ref: "#/components/responses/ServerError",
        },
      },
    },
  },
  "/budaya/{id}": {
    get: {
      summary: "Mendapatkan entri Budaya berdasarkan ID",
      tags: ["Budaya"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "integer",
          },
          description: "ID Budaya",
        },
      ],
      responses: {
        200: {
          description: "Data Budaya",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "success",
                  },
                  budaya: {
                    $ref: "#/components/schemas/Budaya",
                  },
                },
              },
            },
          },
        },
        404: {
          $ref: "#/components/responses/NotFoundError",
        },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
    put: {
      summary: "Memperbarui entri Budaya",
      tags: ["Budaya"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "integer",
          },
          description: "ID Budaya",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                nama: {
                  type: "string",
                  example: "Tari Kecak Updated",
                },
                deskripsi: {
                  type: "string",
                  example:
                    "Tari Kecak adalah tarian tradisional Bali yang diperbarui.",
                },
                gambar: {
                  type: "string",
                  format: "binary",
                  description: "File gambar baru Budaya (opsional)",
                },
                daerahId: {
                  type: "integer",
                  example: 1,
                  description: "ID Daerah terkait",
                },
                typeBudaya: {
                  type: "string",
                  enum: [
                    "KULINER",
                    "TRADISI",
                    "SENI",
                    "MUSIK",
                    "BAHASA",
                    "LAINNYA",
                  ],
                  example: "SENI",
                  description: "Tipe Budaya",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Entri Budaya berhasil diperbarui",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Budaya berhasil diperbarui",
                  },
                  budaya: {
                    $ref: "#/components/schemas/Budaya",
                  },
                },
              },
            },
          },
        },
        400: { description: "Input tidak valid" },
        401: {
          $ref: "#/components/responses/UnauthorizedError",
        },
        403: {
          $ref: "#/components/responses/ForbiddenError",
        },
        404: { $ref: "#/components/responses/NotFoundError" },
        500: {
          $ref: "#/components/responses/ServerError",
        },
      },
    },
    delete: {
      summary: "Menghapus entri Budaya",
      tags: ["Budaya"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "integer",
          },
          description: "ID Budaya",
        },
      ],
      responses: {
        200: {
          description: "Entri Budaya berhasil dihapus",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Budaya berhasil dihapus",
                  },
                },
              },
            },
          },
        },
        401: {
          $ref: "#/components/responses/UnauthorizedError",
        },
        403: {
          $ref: "#/components/responses/ForbiddenError",
        },
        404: { $ref: "#/components/responses/NotFoundError" },
        500: {
          $ref: "#/components/responses/ServerError",
        },
      },
    },
  },
};

export default budayaPath;
