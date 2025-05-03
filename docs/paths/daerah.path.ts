const daerahPath = {
  "/daerah": {
    get: {
      summary: "Mendapatkan semua entri Daerah",
      tags: ["Daerah"],
      responses: {
        200: {
          description: "Daftar semua entri Daerah",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "success",
                  },
                  daerah: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/Daerah",
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
      summary: "Membuat entri Daerah baru",
      tags: ["Daerah"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: ["nama", "gambar", "provinsiId"],
              properties: {
                nama: {
                  type: "string",
                  example: "Daerah Baru",
                },
                gambar: {
                  type: "string",
                  format: "binary",
                  description: "File gambar Daerah",
                },
                provinsiId: {
                  type: "integer",
                  example: 1,
                  description: "ID Provinsi induk",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Entri Daerah berhasil dibuat",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Daerah berhasil dibuat",
                  },
                  daerah: {
                    $ref: "#/components/schemas/Daerah",
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
  "/daerah/{id}": {
    get: {
      summary: "Mendapatkan entri Daerah berdasarkan ID",
      tags: ["Daerah"],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "integer",
          },
          description: "ID Daerah",
        },
      ],
      responses: {
        200: {
          description: "Data Daerah",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "success",
                  },
                  daerah: {
                    $ref: "#/components/schemas/Daerah",
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
      summary: "Memperbarui entri Daerah",
      tags: ["Daerah"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "integer",
          },
          description: "ID Daerah",
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
                  example: "Daerah Updated",
                },
                gambar: {
                  type: "string",
                  format: "binary",
                  description: "File gambar baru Daerah (opsional)",
                },
                provinsiId: {
                  type: "integer",
                  example: 1,
                  description: "ID Provinsi induk",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Entri Daerah berhasil diperbarui",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Daerah berhasil diperbarui",
                  },
                  daerah: {
                    $ref: "#/components/schemas/Daerah",
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
      summary: "Menghapus entri Daerah",
      tags: ["Daerah"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "integer",
          },
          description: "ID Daerah",
        },
      ],
      responses: {
        200: {
          description: "Entri Daerah berhasil dihapus",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Daerah berhasil dihapus",
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

export default daerahPath;
