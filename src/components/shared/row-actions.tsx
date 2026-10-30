"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { ConfirmDeleteDialog } from "@/components/shared/confirm-delete-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ActionResult } from "@/lib/form";

/** เมนู ⋯ ท้ายแถว: แก้ไข / ลบ */
export function RowActions({
  itemName,
  onDelete,
  renderEdit,
}: {
  itemName: string;
  onDelete: () => Promise<ActionResult>;
  renderEdit: (props: { open: boolean; onOpenChange: (open: boolean) => void }) => React.ReactNode;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="ตัวเลือก">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil />
            แก้ไข
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onSelect={() => setDeleteOpen(true)}>
            <Trash2 />
            ลบ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {renderEdit({ open: editOpen, onOpenChange: setEditOpen })}
      <ConfirmDeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} itemName={itemName} onConfirm={onDelete} />
    </>
  );
}
