import { z } from "zod";

export const TrackAndTraceSchema = z.object({
  trackAndTrace: z.string().min(30).max(255).nonempty('track and trace is required'),
  verification: z.string().max(255).nonempty('verification is required'),
})