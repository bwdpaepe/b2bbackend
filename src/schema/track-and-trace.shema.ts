import { z } from "zod";

export const TrackAndTraceSchema = z.object({
  ttc: z.string().min(30).max(255).nonempty('track and trace is required'),
  verify: z.string().max(255).nonempty('verification is required'),
})