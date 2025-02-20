import { useState } from "react";
import { formatDate } from "date-fns";
import { Trash2, MoreVertical, View, File } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { atsResult } from "@prisma/client";
import { DeleteDialog } from "../DeleteDialog";

interface AtsRowProps {
  ats: atsResult;
  isSelected: boolean;
  onSelect: () => void;
  isPending: boolean;
}

export function AtsRow({ ats, isSelected, onSelect, isPending }: AtsRowProps) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <TableRow className="h-[100px]">
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          disabled={isPending}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-4">
          <div className="overflow-hidden border rounded">
            <File className="size-8" />
          </div>
          <div>
            <h3 className="font-semibold">{ats.title || "Untitled Resume"}</h3>
          </div>
        </div>
      </TableCell>
      <TableCell>{formatDate(ats.updatedAt, "MMM d, yyyy")}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/ats/create?id=${ats.id}`}>
                <View className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setShowDelete(true)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
      <DeleteDialog
        id={ats.id}
        open={showDelete}
        onOpenChange={setShowDelete}
        type="ats"
      />
    </TableRow>
  );
}
