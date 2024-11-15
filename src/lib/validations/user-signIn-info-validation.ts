import * as z from "zod";

export const userSignInInfoValidation = z.object({
  email: z.string({
    required_error: "Required",
  }),
  password: z
    .string({
      required_error: "Required",
    })
    .min(3, { message: "Required" })
    .max(15),
});
