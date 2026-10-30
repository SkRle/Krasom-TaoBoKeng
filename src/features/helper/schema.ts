import { z } from "zod";
import { optionalIdSchema, optionalText, personFields } from "@/lib/form";

export const helperSchema = z.object({
  ...personFields,
  nickName: optionalText(100),
  address: optionalText(1000),
  sex: optionalText(10),
  status: optionalText(50),
  mediumId: optionalIdSchema,
});
