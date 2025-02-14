import { useState } from "react";
import { useReactToPrint } from "react-to-print";
import { formatDate } from "date-fns";
import { Printer, Trash2, MoreVertical, Download, View } from "lucide-react";
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
import { ResumePreview } from "@/components/main/Resume/ResumePreview/ResumePreview";
import { DeleteDialog } from "@/components/main/DeleteResumeDiaog";
import { mapToResumeValues } from "@/lib/utils";
import type { ResumeServerData } from "@/lib/types";

interface ResumeRowProps {
  resume: ResumeServerData;
  isSelected: boolean;
  onSelect: () => void;
  contentRef: React.RefObject<HTMLDivElement>;
  isPending: boolean;
}

export function ResumeRow({
  resume,
  isSelected,
  onSelect,
  contentRef,
  isPending,
}: ResumeRowProps) {
  const [showDelete, setShowDelete] = useState(false);

  const printFn = useReactToPrint({
    contentRef,
    documentTitle: resume.title || "Resume",
  });

  return (
    <TableRow className="h-[200px]">
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          disabled={isPending}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-4">
          <div className="w-32 h-40 overflow-hidden border rounded">
            <ResumePreview
              resumeData={mapToResumeValues(resume)}
              className="transform scale-[0.2] origin-top-left w-[500%] h-[500%]"
              contentRef={contentRef}
            />
          </div>
          <div>
            <h3 className="font-semibold">
              {resume.title || "Untitled Resume"}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {resume.description || "No description"}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>{formatDate(resume.updatedAt, "MMM d, yyyy")}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/resumes/editor?resumeId=${resume.id}`}>
                <View className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => printFn}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {}}>
              <Download className="mr-2 h-4 w-4" />
              Export
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
        id={resume.id}
        open={showDelete}
        onOpenChange={setShowDelete}
        isResume
      />
    </TableRow>
  );
}
