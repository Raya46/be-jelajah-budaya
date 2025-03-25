const userPath = {
  "/users": {
    get: {
      summary: "Mendapatkan semua pengguna (hanya SUPER_ADMIN)",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Daftar semua pengguna",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "success",
                  },
                  users: {
                    type: "array",
                    items: {
                      $ref: "#/components/schemas/User",
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
  },
  "/users/{id}": {
    get: {
      summary: "Mendapatkan pengguna berdasarkan ID",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "integer",
          },
          description: "ID pengguna",
        },
      ],
      responses: {
        200: {
          description: "Data pengguna",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "success",
                  },
                  user: {
                    $ref: "#/components/schemas/User",
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
      summary: "Memperbarui pengguna",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "integer",
          },
          description: "ID pengguna",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                username: {
                  type: "string",
                  example: "johndoe_updated",
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "john_updated@example.com",
                },
                password: {
                  type: "string",
                  format: "password",
                  example: "newpassword123",
                },
                alamat: {
                  type: "string",
                  example: "Jl. Contoh Baru No. 456",
                },
                role: {
                  type: "string",
                  enum: ["USER", "ADMIN_DAERAH", "SUPER_aDMIN"],
                  example: "ADMIN_DAERAH",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Pengguna berhasil diperbarui",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User berhasil diperbarui",
                  },
                  user: {
                    $ref: "#/components/schemas/User",
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
      summary: "Menghapus pengguna",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          in: "path",
          name: "id",
          required: true,
          schema: {
            type: "integer",
          },
          description: "ID pengguna",
        },
      ],
      responses: {
        200: {
          description: "Pengguna berhasil dihapus",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User berhasil dihapus",
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

export default userPath;
