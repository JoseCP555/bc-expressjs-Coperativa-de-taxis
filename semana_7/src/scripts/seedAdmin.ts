import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { env } from "../config/env";
import { UserModel } from "../models/User";

async function run(): Promise<void> {
  if (!env.bootstrapAdminEmail || !env.bootstrapAdminPassword || env.bootstrapAdminPassword.startsWith("REPLACE_")) {
    throw new Error("Configura BOOTSTRAP_ADMIN_EMAIL y una contraseña real en .env antes de crear el admin.");
  }
  await mongoose.connect(env.mongoUri);
  const email = env.bootstrapAdminEmail.toLowerCase().trim();
  const existing = await UserModel.findOne({ email });
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
      console.log("El usuario existente fue promovido a administrador.");
    } else {
      console.log("Ese administrador ya existe.");
    }
  } else {
    const password = await bcrypt.hash(env.bootstrapAdminPassword, 12);
    await UserModel.create({ name: "Administrador Taxicoop", email, password, role: "admin" });
    console.log("Administrador inicial creado.");
  }
  await mongoose.disconnect();
}

void run().catch(async (error: unknown) => {
  console.error("No se pudo crear el administrador:", error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
