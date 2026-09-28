import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";
import { UserModel, type IUser } from "../models/User";
import type { AuthUser } from "../types/auth";
import { createAccessToken, createRefreshToken, hashToken, tokenHashesMatch, verifyRefreshToken } from "../utils/tokenService";

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

function publicUser(user: IUser): AuthUser {
  return { id: String(user._id), name: user.name, email: user.email, role: user.role };
}

function createSession(user: IUser): AuthSession {
  return {
    user: publicUser(user),
    accessToken: createAccessToken(String(user._id), user.role),
    refreshToken: createRefreshToken(String(user._id))
  };
}

export async function register(name: string, email: string, password: string): Promise<AuthSession> {
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await UserModel.create({ name, email, password: passwordHash, role: "customer" });
  const session = createSession(user);
  user.refreshTokenHash = hashToken(session.refreshToken);
  await user.save();
  return session;
}

export async function login(email: string, password: string): Promise<AuthSession> {
  const user = await UserModel.findOne({ email }).select("+password +refreshTokenHash");
  const invalidCredentials = new AppError("Correo o contraseña incorrectos.", 401);
  if (!user) throw invalidCredentials;
  const passwordIsValid = await bcrypt.compare(password, user.password);
  if (!passwordIsValid) throw invalidCredentials;

  const session = createSession(user);
  user.refreshTokenHash = hashToken(session.refreshToken);
  await user.save();
  return session;
}

export async function refreshSession(token: string): Promise<AuthSession> {
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new AppError("Refresh token no válido o expirado.", 401);
  }
  const user = await UserModel.findById(payload.sub).select("+refreshTokenHash");
  if (!user || !tokenHashesMatch(user.refreshTokenHash, hashToken(token))) {
    throw new AppError("Refresh token no válido o ya utilizado.", 401);
  }

  const session = createSession(user);
  user.refreshTokenHash = hashToken(session.refreshToken);
  await user.save();
  return session;
}

export async function logout(token?: string): Promise<void> {
  if (!token) return;
  const decoded = jwt.decode(token);
  if (!decoded || typeof decoded === "string" || typeof decoded.sub !== "string") return;
  const user = await UserModel.findById(decoded.sub).select("+refreshTokenHash");
  if (user && tokenHashesMatch(user.refreshTokenHash, hashToken(token))) {
    user.refreshTokenHash = undefined;
    await user.save();
  }
}
