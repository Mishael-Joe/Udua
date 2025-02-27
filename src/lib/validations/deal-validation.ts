// lib/validations/deal-validation.ts
import { z } from "zod";

const dealBaseSchema = z.object({
  storeID: z.string(),
  dealType: z.enum([
    "percentage",
    "fixed",
    "bogo",
    "free_shipping",
    "flash_sale",
  ]),
  productIds: z.array(z.string()),
});

const flashSaleSchema = dealBaseSchema.extend({
  dealType: z.literal("flash_sale"),
  percentage: z
    .number({
      required_error: "Required",
    })
    .min(10, { message: "Minimum is 10%" })
    .max(70, { message: "Maximum is 70%" }),
  flashSaleQuantity: z
    .number({
      required_error: "Required",
    })
    .min(20, { message: "Minimum required quantity is 20" }),
  startDate: z.date({
    required_error: "Required",
  }),
  endDate: z.date({
    required_error: "Required",
  }),
});

const dealPercentageSchema = dealBaseSchema.extend({
  dealType: z.literal("percentage"),
  percentage: z.number().min(10).max(70),
});

const dealFixedSchema = dealBaseSchema.extend({
  dealType: z.literal("fixed"),
  amount: z.number().min(1),
});

// Add other deal type schemas as needed...

export const dealSchema = z.discriminatedUnion("dealType", [
  // dealPercentageSchema,
  flashSaleSchema,
  // dealFixedSchema,
  // Add other schemas
]);

export type DealFormValues = z.infer<typeof dealSchema>;
