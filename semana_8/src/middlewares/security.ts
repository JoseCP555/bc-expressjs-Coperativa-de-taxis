import cors, { type CorsOptions } from "cors";
import mongoSanitizePackage from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

const corsOptions: CorsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
    return callback(new AppError("Origen no permitido por la política CORS.", 403));
  }
};

export const securityCors = cors(corsOptions);
export const mongoSanitize = mongoSanitizePackage({ replaceWith: "_" });
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Demasiadas solicitudes. Intenta de nuevo más tarde." }
});
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Demasiados intentos de autenticación. Espera 15 minutos." }
});
