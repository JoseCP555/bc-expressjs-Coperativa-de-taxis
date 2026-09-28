import { Document, Schema, model } from "mongoose";
import type { UserRole } from "../types/auth";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254, index: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["admin", "dispatcher", "driver", "customer"], default: "customer", required: true },
  refreshTokenHash: { type: String, select: false }
}, { timestamps: true, versionKey: false });

export const UserModel = model<IUser>("User", userSchema);
