const requestPath = {
    "/requests": {
      get: {
        summary: "Mendapatkan semua request admin daerah",
        tags: ["RequestAdminDaerah"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Daftar semua request admin daerah",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "success",
                    },
                    requests: {
                      type: "array",
                      items: {
                        $ref: "#/components/schemas/RequestAdminDaerah",
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
        summary: "Membuat request admin daerah baru",
        tags: ["RequestAdminDaerah"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  namaDaerah: {
                    type: "string",
                    example: "Nama Daerah",
                  },
                  userId: {
                    type: "integer",
                    example: 1,
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
            description: "Request admin daerah berhasil dibuat",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Request berhasil dibuat",
                    },
                    request: {
                      $ref: "#/components/schemas/RequestAdminDaerah",
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
    "/requests/{id}": {
      get: {
        summary: "Mendapatkan request admin daerah berdasarkan ID",
        tags: ["RequestAdminDaerah"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID request",
          },
        ],
        responses: {
          200: {
            description: "Data request admin daerah",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "success",
                    },
                    request: {
                      $ref: "#/components/schemas/RequestAdminDaerah",
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
        summary: "Memperbarui request admin daerah",
        tags: ["RequestAdminDaerah"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID request",
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  namaDaerah: {
                    type: "string",
                    example: "Nama Daerah Updated",
                  },
                  status: {
                    type: "string",
                    enum: ["ACCEPT", "PENDING", "REJECT"],
                    example: "ACCEPT",
                  },
                  userId: {
                    type: "integer",
                    example: 1,
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
            description: "Request admin daerah berhasil diperbarui",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Request berhasil diperbarui",
                    },
                    request: {
                      $ref: "#/components/schemas/RequestAdminDaerah",
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
        summary: "Menghapus request admin daerah",
        tags: ["RequestAdminDaerah"],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            in: "path",
            name: "id",
            required: true,
            schema: {
              type: "integer",
            },
            description: "ID request",
          },
        ],
        responses: {
          200: {
            description: "Request admin daerah berhasil dihapus",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "Request berhasil dihapus",
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
  
  export default requestPath;