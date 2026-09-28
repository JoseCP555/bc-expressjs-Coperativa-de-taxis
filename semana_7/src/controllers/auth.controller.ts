import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import * as authService from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";

export const register: RequestHandler = asyncHandler(async (req, res) => {
  const input = registerSchema.parse(req.body);
  const session = await authService.register(input.name, input.email, input.password);
  setAuthCookies(res, session.accessToken, session.refreshToken);
  res.status(201).json({ message: "Cuenta creada.", user: session.user });
});

export const login: RequestHandler = asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const session = await authService.login(input.email, input.password);
  setAuthCookies(res, session.accessToken, session.refreshToken);
  res.status(200).json({ message: "Sesión iniciada.", user: session.user });
});

export const refresh: RequestHandler = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new AppError("No se encontró el refresh token.", 401);
  const session = await authService.refreshSession(token);
  setAuthCookies(res, session.accessToken, session.refreshToken);
  res.status(200).json({ message: "Sesión renovada.", user: session.user });
});

export const logout: RequestHandler = asyncHandler(async (req, res) => {
  await authService.logout(req.cookies?.refreshToken);
  clearAuthCookies(res);
  res.status(200).json({ message: "Sesión cerrada." });
});

export const me: RequestHandler = (req, res) => {
  if (!req.user) throw new AppError("Debes iniciar sesión.", 401);
  res.status(200).json({ user: req.user });
};
