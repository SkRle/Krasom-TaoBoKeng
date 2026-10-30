"use client";

import { useState } from "react";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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

type DialogProps = { open: boolean; onOpenChange: (open: boolean) => void };

/** เมนู ⋯ ท้ายแถว: (ดูข้อมูล) / แก้ไข / ลบ */
export function RowActions({
  itemName,
  onDelete,
  renderEdit,
  renderView,
}: {
  itemName: string;
  onDelete: () => Promise<ActionResult>;
  renderEdit: (props: DialogProps) => React.ReactNode;
  /** หน้าต่างดูข้อมูล (ถ้ามี) — `onEdit` ปิดหน้าต่างนี้แล้วเปิดฟอร์มแก้ไข */
  renderView?: (props: DialogProps & { onEdit: () => void }) => React.ReactNode;
}) {
  const [viewOpen, setViewOpen] = useState(false);
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
          {renderView && (
            <DropdownMenuItem onSelect={() => setViewOpen(true)}>
              <Eye />
              ดูข้อมูล
            </DropdownMenuItem>
          )}
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
      {renderView?.({
        open: viewOpen,
        onOpenChange: setViewOpen,
        onEdit: () => {
          setViewOpen(false);
          setEditOpen(true);
        },
      })}
      {renderEdit({ open: editOpen, onOpenChange: setEditOpen })}
      <ConfirmDeleteDialog open={deleteOpen} onOpenChange={setDeleteOpen} itemName={itemName} onConfirm={onDelete} />
    </>
  );
}
