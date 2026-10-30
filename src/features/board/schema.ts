import { z } from "zod";
import { optionalIdSchema, optionalText, personFields } from "@/lib/form";

export const boardSchema = z.object({
  ...personFields,
  nickName: optionalText(100),
  positionId: optionalIdSchema,
});
