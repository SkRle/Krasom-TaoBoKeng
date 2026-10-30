"use client";

import { RowActions } from "@/components/shared/row-actions";
import { formatFullName } from "@/lib/utils";
import { deleteMedium } from "../actions";
import type { MediumListRow } from "../types";
import { MediumDetailDialog } from "./medium-detail-dialog";
import { MediumFormDialog } from "./medium-form-dialog";

export function MediumRowActions({ medium }: { medium: MediumListRow }) {
  return (
    <RowActions
      itemName={formatFullName(medium)}
      onDelete={() => deleteMedium(medium.id)}
      renderView={(props) => <MediumDetailDialog medium={medium} {...props} />}
      renderEdit={(props) => <MediumFormDialog medium={medium} {...props} />}
    />
  );
}
