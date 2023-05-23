import { z } from "zod";

export const BestellingUpdateSchema = z.object({
  leveradresStraat: z.string().trim().min(1).max(255),
  leveradresNummer: z.string().trim().min(1).max(255),
  leveradresStad: z.string().trim().min(1).max(255),
  leveradresPostcode: z.string().trim().min(1).max(255),
  leveradresLand: z.string().trim().min(1).max(255),
  doosId: z.number().int().positive().safe(),
});
