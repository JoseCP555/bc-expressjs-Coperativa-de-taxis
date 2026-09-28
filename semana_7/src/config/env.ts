import "dotenv/config";

const accessSecret = process.env.JWT_ACCESS_SECRET ?? "";
const refreshSecret = process.env.JWT_REFRESH_SECRET ?? "";
if (accessSecret.length < 32 || refreshSecret.length < 32 || accessSecret.startsWith("REPLACE_") || refreshSecret.startsWith("REPLACE_")) {
  throw new Error("JWT_ACCESS_SECRET y JWT_REFRESH_SECRET deben tener al menos 32 caracteres. Copia .env.example a .env y reemplaza los valores.");
}
if (accessSecret === refreshSecret) {
  throw new Error("JWT_ACCESS_SECRET y JWT_REFRESH_SECRET deben ser diferentes.");
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3007),
  mongoUri: process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/taxicoop_semana_7",
  accessSecret,
  refreshSecret,
  accessTtl: process.env.ACCESS_TOKEN_TTL ?? "15m",
  refreshTtl: process.env.REFRESH_TOKEN_TTL ?? "7d",
  cookieSameSite: (process.env.COOKIE_SAME_SITE ?? "lax") as "lax" | "strict" | "none",
  cookieSecure: process.env.COOKIE_SECURE === "true" || process.env.NODE_ENV === "production",
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:3000,http://localhost:5173").split(",").map((value) => value.trim()).filter(Boolean),
  bootstrapAdminEmail: process.env.BOOTSTRAP_ADMIN_EMAIL ?? "",
  bootstrapAdminPassword: process.env.BOOTSTRAP_ADMIN_PASSWORD ?? ""
};
