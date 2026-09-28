import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({ message: "Datos inválidos", errors: error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })) });
    return;
  }
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }
  const err = error as { code?: number; name?: string; message?: string };
  if (err?.code === 11000) {
    res.status(409).json({ message: "Ya existe un registro con esos datos." });
    return;
  }
  if (err?.name === "CastError" || err?.name === "ValidationError") {
    res.status(400).json({ message: "Los datos enviados no son válidos." });
    return;
  }
  console.error("Error no controlado:", error);
  res.status(500).json({ message: "Error interno del servidor." });
};
