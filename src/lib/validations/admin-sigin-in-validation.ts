import * as z from "zod";

export const adminSignInInfoValidation = z.object({
  email: z.string({
    required_error: "Required",
  }),
  password: z.string({
    required_error: "Required",
  })  
  .min(3, { message: "Your Admin Password" })
  .max(15),
});
