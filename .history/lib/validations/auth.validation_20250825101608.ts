import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.string().min(1, { message: "Usesrname is required" }),
  pin: z.string().min(1, { message: "Password is required" }),
});
