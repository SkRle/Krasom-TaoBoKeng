import { connection } from "next/server";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPositionOptions } from "@/features/position/queries";
import { BoardFormDialog } from "./board-form-dialog";

export async function BoardCreateButton() {
  await connection();
  const positionOptions = await getPositionOptions();
  return (
    <BoardFormDialog
      positionOptions={positionOptions}
      trigger={
        <Button size="lg" className="h-10 px-4">
          <Plus />
          เพิ่มกรรมการ
        </Button>
      }
    />
  );
}
