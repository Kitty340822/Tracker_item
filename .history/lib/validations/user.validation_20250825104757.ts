import * as z from "zod";

export const CreateUserSchema = z.object({
  name: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(6, { message: "PIN must containe at least 6 digits" }),
  // displayName: z.string().min(1, { message: "Display name is required." }),
  email: z.string().min(1, { message: "Email is required." }).email(),
  phone : z.string().optional(),
  role_permission : z.string().optional(),
  // isManager: z.boolean().optional(),
});
