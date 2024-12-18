import { z } from "zod";

export const ZodAuthSchema = z.object({
    username: z.string().min(5, { message: "Invalid username address" }),
    password: z.string().min(5, "Password must be 8 or more characters long"),
});
