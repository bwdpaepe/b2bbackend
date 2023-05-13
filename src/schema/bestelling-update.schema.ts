import { z } from "zod";

export const BestellingUpdateSchema = z.object({
  leveradres: z.object({
    straat: z.string().max(255).nonempty('street is required'),
    nummer: z.string().max(255).nonempty('number is required'),
    stad: z.string().max(255).nonempty('city is required'),
    postcode: z.string().max(255).nonempty('street is required'),
    land: z.string().max(255).nonempty('country is required'),
  }),
  doosId: z.number({
    required_error: "doos is required",
    invalid_type_error: "doos must be a number",
  }),
})