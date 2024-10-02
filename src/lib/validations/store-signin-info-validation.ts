import * as z from "zod";

export const storeSignInInfoValidation = z.object({
  storeID: z.string({
    required_error: "Required",
  }),
  password: z.string({
    required_error: "Required",
  }),
});
