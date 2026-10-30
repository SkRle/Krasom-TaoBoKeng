"use client";

import { RowActions } from "@/components/shared/row-actions";
import { formatFullName } from "@/lib/utils";
import { deleteMedium } from "../actions";
import type { MediumRow } from "../types";
import { MediumFormDialog } from "./medium-form-dialog";

export function MediumRowActions({ medium }: { medium: MediumRow }) {
  return (
    <RowActions
      itemName={formatFullName(medium)}
      onDelete={() => deleteMedium(medium.id)}
      renderEdit={(props) => <MediumFormDialog medium={medium} {...props} />}
    />
  );
}
