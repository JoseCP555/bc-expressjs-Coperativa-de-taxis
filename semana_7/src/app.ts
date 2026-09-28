import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { env } from "./config/env";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import { authRouter } from "./routes/auth.routes";
import { tripRouter } from "./routes/trip.routes";
import { authMiddleware } from "./middlewares/auth.middleware";

export const app = express();
app.disable("x-powered-by");
app.use(cors({ origin: env.corsOrigins, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/health", (_req, res) => res.status(200).json({ status: "ok", service: "taxicoop-auth-semana-7" }));
app.use("/api/auth", authRouter);
app.use("/api/trips", tripRouter);
app.get("/api/dashboard", authMiddleware, (req, res) => {
  res.status(200).json({ message: "API de Cooperativa de Taxis", user: req.user });
});
app.use(notFound);
app.use(errorHandler);
