import type { RequestHandler } from "express";
import mongoose from "mongoose";
import { AppError } from "../errors/AppError";
import { UserModel } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyAccessToken } from "../utils/tokenService";

export const authMiddleware: RequestHandler = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) throw new AppError("Debes iniciar sesión.", 401);

  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new AppError("La sesión no es válida o expiró.", 401);
  }
  if (!payload.sub || !mongoose.isValidObjectId(payload.sub)) throw new AppError("La sesión no es válida.", 401);

  const user = await UserModel.findById(payload.sub).select("name email role");
  if (!user) throw new AppError("La sesión ya no está activa.", 401);
  req.user = { id: String(user._id), name: user.name, email: user.email, role: user.role };
  next();
});
