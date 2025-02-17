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
import { InterviewResult } from "@prisma/client";
import { DeleteInterviewDialog } from "./DeleteInterviewDiaog";

interface InterviewRowProps {
  interview: InterviewResult;
  isSelected: boolean;
  onSelect: () => void;
  isPending: boolean;
}

export function InterviewRow({
  interview,
  isSelected,
  onSelect,
  isPending,
}: InterviewRowProps) {
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
            <h3 className="font-semibold">
              {interview.title || "Untitled Resume"}
            </h3>
          </div>
        </div>
      </TableCell>
      <TableCell>{formatDate(interview.updatedAt, "MMM d, yyyy")}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/interview/create?id=${interview.id}`}>
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
      <DeleteInterviewDialog
        id={interview.id}
        open={showDelete}
        onOpenChange={setShowDelete}
      />
    </TableRow>
  );
}
