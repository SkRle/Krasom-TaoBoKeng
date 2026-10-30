"use client";

import { RowActions } from "@/components/shared/row-actions";
import type { Option } from "@/lib/constants";
import { formatFullName } from "@/lib/utils";
import { deleteBoardMember } from "../actions";
import type { BoardRow } from "../types";
import { BoardFormDialog } from "./board-form-dialog";

export function BoardRowActions({ member, positionOptions }: { member: BoardRow; positionOptions: Option[] }) {
  return (
    <RowActions
      itemName={formatFullName(member)}
      onDelete={() => deleteBoardMember(member.id)}
      renderEdit={(props) => <BoardFormDialog member={member} positionOptions={positionOptions} {...props} />}
    />
  );
}
