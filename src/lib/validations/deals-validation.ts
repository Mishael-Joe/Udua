import { z } from "zod";

// Define the form schema
export const formSchema = z.object({
  storeID: z.string().min(1, "Store ID is required"),
  storePassword: z.string().min(1, "Store password is required"),
  name: z.string().min(3, "Deal name must be at least 3 characters"),
  description: z.string().optional(),
  dealType: z.enum([
    "percentage",
    "fixed",
    "free_shipping",
    "flash_sale",
    "buy_x_get_y",
  ]),
  value: z.coerce.number().min(0, "Value must be a positive number"),
  productIds: z
    .array(z.string())
    .min(1, "At least one product must be selected"),
  categoryIds: z.array(z.string()).optional(),
  startDate: z
    .date()
    .refine((date) => date >= new Date(), "Start date must be in the future"),
  endDate: z
    .date()
    .refine((date) => date > new Date(), "End date must be in the future"),
  minCartValue: z.coerce.number().optional(),
  maxDiscountValue: z.coerce.number().optional(),
  usageLimit: z.coerce.number().optional(),
  autoApply: z.boolean().default(false),
  applyToSizes: z.array(z.string()).optional(),
  code: z.string().optional(),
  buyQuantity: z.coerce.number().optional(),
  getQuantity: z.coerce.number().optional(),
  getProductIds: z.array(z.string()).optional(),
  flashSaleQuantity: z.coerce.number().optional(),
});
