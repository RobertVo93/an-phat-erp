import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev_secret"; // TODO: Use env var in production

export function signJwt(payload: object, options?: jwt.SignOptions) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d", ...options });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
} 