import { z } from "zod";

export const createTripSchema = z.object({
  pickupAddress: z.string().trim().min(4).max(180),
  dropoffAddress: z.string().trim().min(4).max(180),
  notes: z.string().trim().max(500).optional()
}).strict();

export const updateTripStatusSchema = z.object({
  status: z.enum(["in_progress", "completed", "cancelled"])
}).strict();
