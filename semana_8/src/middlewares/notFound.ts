import type { RequestHandler } from "express";
import { AppError } from "../errors/AppError";

export const notFound: RequestHandler = (req, _res, next) => {
  next(new AppError("Ruta no encontrada: " + req.method + " " + req.path, 404));
};
