import { z } from "zod";
import { optionalText, requiredText } from "@/lib/form";

export const positionSchema = z.object({
  name: requiredText("ชื่อตำแหน่ง", 100),
  belongIn: optionalText(50),
});
