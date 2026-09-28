import sanitizeHtml from "sanitize-html";
import { z } from "zod";

function plainText(minimum: number, maximum: number) {
  return z.string().trim().min(minimum).max(maximum)
    .transform((value) => sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim())
    .pipe(z.string().min(minimum).max(maximum));
}

export const registerSchema = z.object({
  name: plainText(2, 80),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(10).max(72)
}).strict();

export const loginSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(72)
}).strict();
