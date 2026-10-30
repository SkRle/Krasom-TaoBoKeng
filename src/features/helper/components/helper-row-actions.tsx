"use client";

import { RowActions } from "@/components/shared/row-actions";
import { formatFullName } from "@/lib/utils";
import { deleteHelper } from "../actions";
import type { HelperRow, MediumOption } from "../types";
import { HelperFormDialog } from "./helper-form-dialog";

export function HelperRowActions({ helper, mediumOptions }: { helper: HelperRow; mediumOptions: MediumOption[] }) {
  return (
    <RowActions
      itemName={formatFullName(helper)}
      onDelete={() => deleteHelper(helper.id)}
      renderEdit={(props) => <HelperFormDialog helper={helper} mediumOptions={mediumOptions} {...props} />}
    />
  );
}
