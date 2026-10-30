"use client";

import { RowActions } from "@/components/shared/row-actions";
import { deletePosition } from "../actions";
import type { PositionRow } from "../types";
import { PositionFormDialog } from "./position-form-dialog";

export function PositionRowActions({ position }: { position: PositionRow }) {
  return (
    <RowActions
      itemName={position.name ?? "ตำแหน่งนี้"}
      onDelete={() => deletePosition(position.id)}
      renderEdit={(props) => <PositionFormDialog position={position} {...props} />}
    />
  );
}
