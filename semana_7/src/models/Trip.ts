import { Document, Schema, Types, model } from "mongoose";

export type TripStatus = "requested" | "assigned" | "in_progress" | "completed" | "cancelled";

export interface ITrip extends Document {
  createdBy: Types.ObjectId;
  driverId?: Types.ObjectId;
  pickupAddress: string;
  dropoffAddress: string;
  notes?: string;
  status: TripStatus;
  createdAt: Date;
  updatedAt: Date;
}

const tripSchema = new Schema<ITrip>({
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  driverId: { type: Schema.Types.ObjectId, ref: "User", index: true },
  pickupAddress: { type: String, required: true, trim: true, maxlength: 180 },
  dropoffAddress: { type: String, required: true, trim: true, maxlength: 180 },
  notes: { type: String, trim: true, maxlength: 500 },
  status: { type: String, enum: ["requested", "assigned", "in_progress", "completed", "cancelled"], default: "requested", required: true }
}, { timestamps: true, versionKey: false });

export const TripModel = model<ITrip>("Trip", tripSchema);
