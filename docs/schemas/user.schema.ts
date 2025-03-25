const userSchema = {
  User: {
    type: "object",
    required: ["username", "email", "password"],
    properties: {
      id: {
        type: "integer",
        description: "ID user",
      },
      username: {
        type: "string",
        description: "Nama pengguna",
      },
      email: {
        type: "string",
        format: "email",
        description: "Email pengguna",
      },
      password: {
        type: "string",
        format: "password",
        description: "Password pengguna",
      },
      role: {
        type: "string",
        enum: ["USER", "ADMIN_DAERAH", "SUPER_aDMIN"],
        description: "Role pengguna",
      },
      ktp: {
        type: "string",
        description: "Path file KTP (untuk admin daerah)",
      },
      alamat: {
        type: "string",
        description: "Alamat pengguna",
      },
      portofolio: {
        type: "string",
        description: "Path file portofolio (untuk admin daerah)",
      },
      createdAt: {
        type: "string",
        format: "date-time",
        description: "Waktu pembuatan",
      },
      updatedAt: {
        type: "string",
        format: "date-time",
        description: "Waktu update terakhir",
      },
    },
  },
  LoginResponse: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Pesan sukses",
      },
      user: {
        $ref: "#/components/schemas/User",
      },
      token: {
        type: "string",
        description: "JWT token",
      },
    },
  },
  Error: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Pesan error",
      },
      error: {
        type: "string",
        description: "Detail error",
      },
    },
  },
};

export default userSchema;
