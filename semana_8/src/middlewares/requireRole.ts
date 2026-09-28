import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError";
import type { UserRole } from "../types/auth";

export function requireRole(...allowedRoles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.user) return next(new AppError("Debes iniciar sesión.", 401));
    if (!allowedRoles.includes(req.user.role)) return next(new AppError("No tienes permiso para esta acción.", 403));
    next();
  };
}
