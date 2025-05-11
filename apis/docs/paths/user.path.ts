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
  "/users/register-admin": {
    post: {
      summary: "Registrasi Admin Daerah baru (dengan KTP & Portofolio)",
      tags: ["Auth", "Users"],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              required: [
                "username",
                "email",
                "password",
                "alamat",
                "ktp",
                "portofolio",
              ],
              properties: {
                username: {
                  type: "string",
                  example: "admin_daerah_baru",
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "admin.daerah@example.com",
                },
                password: {
                  type: "string",
                  format: "password",
                  example: "password123",
                },
                alamat: {
                  type: "string",
                  example: "Jl. Admin Daerah No. 1",
                },
                namaDaerah: {
                  type: "string",
                  example: "Daerah Istimewa Admin",
                  description:
                    "Nama daerah baru jika belum terdaftar (opsional, jika daerahId tidak diisi)",
                },
                daerahId: {
                  type: "integer",
                  example: 1,
                  description:
                    "ID daerah yang sudah ada (opsional, jika namaDaerah tidak diisi)",
                },
                ktp: {
                  type: "string",
                  format: "binary",
                  description: "File KTP Admin Daerah",
                },
                portofolio: {
                  type: "string",
                  format: "binary",
                  description: "File Portofolio Admin Daerah",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Admin Daerah berhasil diregistrasi",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Registrasi Admin Daerah berhasil",
                  },
                },
              },
            },
          },
        },
        400: {
          description: "Input tidak valid",
        },
        500: {
          $ref: "#/components/responses/ServerError",
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
      summary: "Memperbarui pengguna (termasuk KTP/Portofolio jika ada)",
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
          "multipart/form-data": {
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
                  description: "Kosongkan jika tidak ingin mengubah password",
                  example: "newpassword123",
                },
                alamat: {
                  type: "string",
                  example: "Jl. Contoh Baru No. 456",
                },
                role: {
                  type: "string",
                  enum: ["USER", "ADMIN_DAERAH", "SUPER_ADMIN"],
                  example: "ADMIN_DAERAH",
                  description: "Hanya dapat diubah oleh SUPER_ADMIN",
                },
                ktp: {
                  type: "string",
                  format: "binary",
                  description: "File KTP baru (opsional)",
                },
                portofolio: {
                  type: "string",
                  format: "binary",
                  description: "File Portofolio baru (opsional)",
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
        404: {
          $ref: "#/components/responses/NotFoundError",
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
  "/users/login": {
    post: {
      summary: "Login pengguna",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: {
                  type: "string",
                  format: "email",
                  example: "user@example.com",
                },
                password: {
                  type: "string",
                  format: "password",
                  example: "password123",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Login berhasil",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Login berhasil" },
                  token: {
                    type: "string",
                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                  },
                  user: { $ref: "#/components/schemas/User" },
                },
              },
            },
          },
        },
        401: {
          description: "Email atau password salah",
        },
        500: {
          $ref: "#/components/responses/ServerError",
        },
      },
    },
  },
  "/users/create-admin": {
    post: {
      summary: "Membuat Admin Daerah oleh SUPER_ADMIN (tanpa file)",
      tags: ["Users", "Admin"],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "email", "password", "alamat", "daerahId"],
              properties: {
                username: { type: "string", example: "admin_baru" },
                email: {
                  type: "string",
                  format: "email",
                  example: "admin.baru@example.com",
                },
                password: {
                  type: "string",
                  format: "password",
                  example: "pass123",
                },
                alamat: { type: "string", example: "Jl. Admin Baru No.10" },
                daerahId: { type: "integer", example: 2 },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "Admin Daerah berhasil dibuat",
          content: {
            /* ... schema respons ... */
          },
        },
        400: { description: "Input tidak valid" },
        401: { $ref: "#/components/responses/UnauthorizedError" },
        403: { $ref: "#/components/responses/ForbiddenError" },
        500: { $ref: "#/components/responses/ServerError" },
      },
    },
  },
};

export default userPath;
