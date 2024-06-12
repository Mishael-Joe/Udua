import * as z from "zod";

export const sellerInfoValidation = z.object({
  sellerName: z.string().min(3, { message: "Minimum 3 Characters" }).max(30),
  sellerEmail: z.string(),
  businessName: z.string().min(3, { message: "Minimum 3 Characters" }).max(30),
});
