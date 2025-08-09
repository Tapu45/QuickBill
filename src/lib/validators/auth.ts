import { z } from "zod";

export const registrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  username: z.string().min(3),
  phone: z.string().optional(),
  image: z.string().url().optional(),
});