import { z } from "zod";
import { optionalText, personFields } from "@/lib/form";

export const mediumSchema = z.object({
  ...personFields,
  nickName: optionalText(100),
  address: optionalText(1000),
  sex: z.enum(["male", "female"], { error: "กรุณาเลือกเพศ" }),
  status: optionalText(50),
  godName: z
    .string()
    .optional()
    .transform((v, ctx) => {
      try {
        const parsed = JSON.parse(v || "[]");
        return z.array(z.string().trim().min(1).max(100)).parse(parsed);
      } catch {
        ctx.addIssue({ code: "custom", message: "ชื่อองค์เทพไม่ถูกต้อง" });
        return z.NEVER;
      }
    }),
});
