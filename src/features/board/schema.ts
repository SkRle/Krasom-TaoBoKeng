import { z } from "zod";
import { optionalIdSchema, personFields } from "@/lib/form";

export const boardSchema = z.object({
  ...personFields,
  positionId: optionalIdSchema,
});
