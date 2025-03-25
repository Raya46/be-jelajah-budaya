const budayaPath = {
    "/budaya": {
      get: {
        summary: "Mendapatkan semua entri Budaya",
        tags: ["Budaya"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Daftar semua entri Budaya",
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
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          403: {
            $ref: "#/components/responses/ForbiddenError",
          },
        },
      },
      post: {
        summary: "Membuat entri Budaya baru",
        tags: ["Budaya"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
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
                    example: "http://example.com/tari_kecak.jpg",
                  },
                  daerahId: {
                    type: "integer",
                    example: 1,
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
    },
    "/budaya/{id}": {
      get: {
        summary: "Mendapatkan entri Budaya berdasarkan ID",
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
          401: {
            $ref: "#/components/responses/UnauthorizedError",
          },
          403: {
            $ref: "#/components/responses/ForbiddenError",
          },
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
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  nama: {
                    type: "string",
                    example: "Tari Kecak Updated",
                  },
                  deskripsi: {
                    type: "string",
                    example: "Tari Kecak adalah tarian tradisional Bali yang diperbarui.",
                  },
                  gambar: {
                    type: "string",
                    example: "http://example.com/tari_kecak_updated.jpg",
                  },
                  daerahId: {
                    type: "integer",
                    example: 1,
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
          500: {
            $ref: "#/components/responses/ServerError",
          },
        },
      },
    },
  };
  
  export default budayaPath;