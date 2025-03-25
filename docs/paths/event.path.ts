const eventPath = {
    "/events": {
      get: {
        summary: "Mendapatkan semua entri Event",
        tags: ["Event"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Daftar semua entri Event",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "success",
                    },
                    events: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Event",
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
        summary: "Membuat entri Event baru",
        tags: ["Event"],
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
                    example: "Festival Budaya",
                  },
                  deskripsi: {
                    type: "string",
                    example: "Festival Budaya adalah acara tahunan.",
                  },
                  gambar: {
                    type: "string",
                    example: "http://example.com/festival_budaya.jpg",
                  },
                  tanggal: {
                    type: "string",
                    format: "date-time",
                    example: "2025-03-25T10:00:00Z",
                  },
                  lokasi: {
                    type: "string",
                    example: "Lapangan Merdeka",
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
          201: {
            description: "Entri Event berhasil dibuat",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Event berhasil dibuat",
                    },
                    event: {
                      $ref: "#/components/schemas/Event",
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
    "/events/{id}": {
      get: {
        summary: "Mendapatkan entri Event berdasarkan ID",
        tags: ["Event"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID Event",
          },
        ],
        responses: {
          200: {
            description: "Data Event",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "success",
                    },
                    event: {
                      $ref: "#/components/schemas/Event",
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
        summary: "Memperbarui entri Event",
        tags: ["Event"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID Event",
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
                    example: "Festival Budaya Updated",
                  },
                  deskripsi: {
                    type: "string",
                    example: "Festival Budaya adalah acara tahunan yang diperbarui.",
                  },
                  gambar: {
                    type: "string",
                    example: "http://example.com/festival_budaya_updated.jpg",
                  },
                  tanggal: {
                    type: "string",
                    format: "date-time",
                    example: "2025-03-26T10:00:00Z",
                  },
                  lokasi: {
                    type: "string",
                    example: "Lapangan Merdeka Updated",
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
            description: "Entri Event berhasil diperbarui",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Event berhasil diperbarui",
                    },
                    event: {
                      $ref: "#/components/schemas/Event",
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
        summary: "Menghapus entri Event",
        tags: ["Event"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID Event",
          },
        ],
        responses: {
          200: {
            description: "Entri Event berhasil dihapus",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Event berhasil dihapus",
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
  
  export default eventPath;