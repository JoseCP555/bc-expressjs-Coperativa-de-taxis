import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { authLimiter, globalLimiter, securityCors } from "./middlewares/security";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { authRouter } from "./routes/auth.routes";
import { tripRouter } from "./routes/trip.routes";
import { adminRouter } from "./routes/admin.routes";
import { authMiddleware } from "./middlewares/auth.middleware";
import { requireRole } from "./middlewares/requireRole";
import { mongoSanitize } from "./middlewares/security";
import { env } from "./config/env";

export const app = express();
app.disable("x-powered-by");
app.use(helmet({ hsts: env.nodeEnv === "production" ? { maxAge: 31536000, includeSubDomains: true } : false }));
app.use(securityCors);
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize);
app.use(cookieParser());
app.use(globalLimiter);

app.get("/health", (_req, res) => res.status(200).json({ status: "ok", service: "taxicoop-security-semana-8" }));
app.use("/api/auth", authLimiter, authRouter);
app.use("/api/trips", tripRouter);
app.use("/api/admin", authMiddleware, requireRole("admin"), adminRouter);
app.get("/api/dashboard", authMiddleware, requireRole("customer", "driver", "dispatcher", "admin"), (req, res) => {
  res.status(200).json({ message: "Panel de Cooperativa de Taxis", user: req.user });
});
app.get("/api/public/info", (_req, res) => res.status(200).json({ name: "Cooperativa de Taxis", apiVersion: "1.0" }));
app.use(notFound);
app.use(errorHandler);
