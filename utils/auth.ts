import jwt from "jsonwebtoken";

export interface authenticatedUser {
  id: number;
  role: string;
  token?: string;
  username: string;
  email: string;
}

export const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "24h" }
  );
};
