import { app } from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./lib/mongoose";

async function start(): Promise<void> {
  await connectDatabase();
  app.listen(env.port, () => console.log("Taxicoop API escuchando en http://localhost:" + env.port));
}

void start().catch((error: unknown) => {
  console.error("No fue posible iniciar la API:", error);
  process.exit(1);
});
