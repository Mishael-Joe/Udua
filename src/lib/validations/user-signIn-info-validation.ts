import * as z from "zod";

export const userSignInInfoValidation = z.object({
  email: z.string({
    required_error: "Required",
  }),
  password: z.string({
    required_error: "Required",
  }),
});
