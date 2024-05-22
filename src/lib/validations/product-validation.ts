import * as z from "zod";

export const productValidation = z.object({
  accountId: z.string({
    required_error: "Required",
  }),
  productName: z
    .string({
      required_error: "Required",
    })
    .min(3, { message: "Minimum 3 Characters" }),
  productPrice: z.string({
    required_error: "Required",
  }),
  productSizes: z.string({
    required_error: "Required",
  }),
  productQuantity: z.string({
    required_error: "Required",
  }),
  productImage: z.array(z.string()).nonempty({ message: "Required" }),
  productDescription: z.string({
    required_error: "Required",
  }),
  productSpecification: z.string({
    required_error: "Required",
  }),
  productCategory: z.string({
    required_error: "Required",
  }),
});
