import { TrackAndTraceSchema } from "../schema/track-and-trace.shema";
import { ZodError} from "zod";

const validateTrackAndTrace = (ctx: any, next: any) => {
  try{
    const result = TrackAndTraceSchema.parse(ctx.body);
    console.log(result);
  }
  catch (error: any) {
    if (error instanceof ZodError) {
      return (ctx.status = 403), (ctx.body = { error: JSON.stringify(error.issues.map((issue) => ({ message: issue.message }))) }); // 403 = Invalid format
    }
    return (ctx.status = 400), (ctx.body = { error: error.message }); // 401 = Unauthorized
  }
  return next();
}

export default{
  validateTrackAndTrace,
};