import { z } from "zod";

export const BestellingUpdateSchema = z.object({
  leveradres: z.object({
    straat: z.string().trim().min(1).max(255),
    nummer: z.string().trim().min(1).max(255),
    stad: z.string().trim().min(1).max(255),
    postcode: z.string().trim().min(1).max(255),
    land: z.string().trim().min(1).max(255),
  }),
  doosId: z.number().int().positive().safe(),
})