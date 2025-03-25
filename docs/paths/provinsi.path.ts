const provinsiPath = {
    "/provinsi": {
      get: {
        summary: "Mendapatkan semua entri Provinsi",
        tags: ["Provinsi"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Daftar semua entri Provinsi",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "success",
                    },
                    provinsi: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/Provinsi",
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
        summary: "Membuat entri Provinsi baru",
        tags: ["Provinsi"],
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
                    example: "Provinsi Baru",
                  },
                  gambar: {
                    type: "string",
                    example: "http://example.com/provinsi_baru.jpg",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Entri Provinsi berhasil dibuat",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Provinsi berhasil dibuat",
                    },
                    provinsi: {
                      $ref: "#/components/schemas/Provinsi",
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
    "/provinsi/{id}": {
      get: {
        summary: "Mendapatkan entri Provinsi berdasarkan ID",
        tags: ["Provinsi"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID Provinsi",
          },
        ],
        responses: {
          200: {
            description: "Data Provinsi",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "success",
                    },
                    provinsi: {
                      $ref: "#/components/schemas/Provinsi",
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
        summary: "Memperbarui entri Provinsi",
        tags: ["Provinsi"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID Provinsi",
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
                    example: "Provinsi Updated",
                  },
                  gambar: {
                    type: "string",
                    example: "http://example.com/provinsi_updated.jpg",
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Entri Provinsi berhasil diperbarui",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Provinsi berhasil diperbarui",
                    },
                    provinsi: {
                      $ref: "#/components/schemas/Provinsi",
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
        summary: "Menghapus entri Provinsi",
        tags: ["Provinsi"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID Provinsi",
          },
        ],
        responses: {
          200: {
            description: "Entri Provinsi berhasil dihapus",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Provinsi berhasil dihapus",
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
  
  export default provinsiPath;