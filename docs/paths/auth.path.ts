const authPath = {
  "/login": {
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
                $ref: "#/components/schemas/LoginResponse",
              },
            },
          },
        },
        401: {
          description: "Email atau password salah",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Error",
              },
            },
          },
        },
        500: {
          $ref: "#/components/responses/ServerError",
        },
      },
    },
  },
  "/register-user": {
    post: {
      summary: "Registrasi pengguna baru",
      tags: ["Auth"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["username", "email", "password"],
              properties: {
                username: {
                  type: "string",
                  example: "johndoe",
                },
                email: {
                  type: "string",
                  format: "email",
                  example: "john@example.com",
                },
                password: {
                  type: "string",
                  format: "password",
                  example: "password123",
                },
                alamat: {
                  type: "string",
                  example: "Jl. Contoh No. 123",
                },
              },
            },
          },
        },
      },
      responses: {
        201: {
          description: "User berhasil dibuat",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "User berhasil dibuat",
                  },
                  user: {
                    $ref: "#/components/schemas/User",
                  },
                },
              },
            },
          },
        },
        500: {
          $ref: "#/components/responses/ServerError",
        },
      },
    },
  },
};

export default authPath;
