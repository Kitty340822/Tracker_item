import * as z from "zod";
import { email } from "zod/v4/core/regexes";

export const CreateUserSchema = z.object({
  name: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(6, { message: "PIN must containe at least 6 digits" }),
  // displayName: z.string().min(1, { message: "Display name is required." }),
  email
  isManager: z.coerce.boolean().default(false),
  permissions: z
    .array(z.string())
    .min(1, { message: "Permission is required." }),
});
