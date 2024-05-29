import * as z from "zod";

export const userSignUpInfoValidation = z.object({
  firstName: z
    .string({
      required_error: "Required",
    })
    .min(3, { message: "Minimum 3 Characters" })
    .max(15),
  lastName: z
    .string({
      required_error: "Required",
    })
    .min(3, { message: "Minimum 3 Characters" })
    .max(15),
  otherNames: z
    .string({
      required_error: "Required",
    })
    .min(3, { message: "Minimum 3 Characters" })
    .max(15),
  email: z.string({
    required_error: "Required",
  }),
  password: z.string({
    required_error: "Required",
  }),
  confirmPassword: z.string({
    required_error: "Required",
  }),
  address: z.string({
    required_error: "Required",
  }),
  phoneNumber: z
    .string({
      required_error: "Required",
    })
    .min(11)
    .max(14),
  cityOfResidence: z.string({
    required_error: "Required",
  }),
  stateOfResidence: z.string({
    required_error: "Required",
  }),
  postalCode: z.string({
    required_error: "Required",
  }),
});
