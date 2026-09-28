import sanitizeHtml from "sanitize-html";
import { z } from "zod";

const safeText = (minimum: number, maximum: number) => z.string().trim().min(minimum).max(maximum)
  .transform((value) => sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim())
  .pipe(z.string().min(minimum).max(maximum));

export const createTripSchema = z.object({
  pickupAddress: safeText(4, 180),
  dropoffAddress: safeText(4, 180),
  notes: z.string().trim().max(500).transform((value) => sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim()).optional()
}).strict();

export const updateTripStatusSchema = z.object({ status: z.enum(["in_progress", "completed", "cancelled"]) }).strict();
export const assignDriverSchema = z.object({ driverId: z.string().trim().min(1) }).strict();
