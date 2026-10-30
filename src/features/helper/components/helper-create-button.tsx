import { connection } from "next/server";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMediumSelectOptions } from "../queries";
import { HelperFormDialog } from "./helper-form-dialog";

export async function HelperCreateButton() {
  await connection();
  const mediumOptions = await getMediumSelectOptions();
  return (
    <HelperFormDialog
      mediumOptions={mediumOptions}
      trigger={
        <Button size="lg" className="h-10 px-4">
          <Plus />
          เพิ่มพี่เลี้ยง
        </Button>
      }
    />
  );
}
