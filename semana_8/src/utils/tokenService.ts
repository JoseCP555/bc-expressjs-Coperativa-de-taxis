import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";
import type { UserRole } from "../types/auth";

interface TokenClaims extends JwtPayload {
  tokenUse?: "access" | "refresh";
  role?: UserRole;
}

export function createAccessToken(userId: string, role: UserRole): string {
  return jwt.sign({ tokenUse: "access", role }, env.accessSecret, {
    algorithm: "HS256", subject: userId, jwtid: randomUUID(), expiresIn: env.accessTtl as SignOptions["expiresIn"]
  });
}

export function createRefreshToken(userId: string): string {
  return jwt.sign({ tokenUse: "refresh" }, env.refreshSecret, {
    algorithm: "HS256", subject: userId, jwtid: randomUUID(), expiresIn: env.refreshTtl as SignOptions["expiresIn"]
  });
}

export function verifyAccessToken(token: string): TokenClaims {
  const payload = jwt.verify(token, env.accessSecret, { algorithms: ["HS256"] });
  if (typeof payload === "string" || payload.tokenUse !== "access" || typeof payload.sub !== "string") {
    throw new AppError("Sesión no válida.", 401);
  }
  return payload as TokenClaims;
}

export function verifyRefreshToken(token: string): TokenClaims {
  const payload = jwt.verify(token, env.refreshSecret, { algorithms: ["HS256"] });
  if (typeof payload === "string" || payload.tokenUse !== "refresh" || typeof payload.sub !== "string") {
    throw new AppError("Refresh token no válido.", 401);
  }
  return payload as TokenClaims;
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function tokenHashesMatch(left: string | undefined, right: string): boolean {
  if (!left) return false;
  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}
