import { Router } from "express";
import mongoose from "mongoose";
import { AppError } from "../errors/AppError";
import { UserModel } from "../models/User";
import type { UserRole } from "../types/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { z } from "zod";

export const adminRouter = Router();

adminRouter.get("/users", asyncHandler(async (_req, res) => {
  const users = await UserModel.find().select("name email role createdAt").sort({ createdAt: -1 });
  res.status(200).json({ users });
}));

adminRouter.patch("/users/:userId/role", asyncHandler(async (req, res) => {
  const parsed = z.object({ role: z.enum(["admin", "dispatcher", "driver", "customer"]) }).strict().parse(req.body);
  const userId = String(req.params.userId);
  if (!mongoose.isValidObjectId(userId)) throw new AppError("Identificador de usuario no válido.", 400);
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError("Usuario no encontrado.", 404);
  user.role = parsed.role as UserRole;
  await user.save();
  res.status(200).json({ message: "Rol actualizado.", user: { id: String(user._id), name: user.name, email: user.email, role: user.role } });
}));
