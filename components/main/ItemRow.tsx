import { useState } from "react";
import { formatDate } from "date-fns";
import { Trash2, MoreVertical, View, File, Printer } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

import {
  CoverLetter,
  atsResult,
  GapResult,
  InterviewResult,
} from "@prisma/client";
import type { ResumeServerData } from "@/lib/types";
import { useReactToPrint } from "react-to-print";
import { DeleteDialog } from "./DeleteDialog";
import { CoverLetterPreview } from "./coverLetter/CoverLetterPreview/CoverLetterPreview";
import { ResumePreview } from "./Resume/ResumePreview/ResumePreview";
import { mapToCoverLetterValues, mapToResumeValues } from "@/lib/utils";
import Link from "next/link";

interface Props {
  isSelected: boolean;
  onSelect: () => void;
  contentRef?: React.RefObject<HTMLDivElement>;
  isPending: boolean;
  type: "resume" | "letter" | "ats" | "gap" | "interview";
  recivedData:
    | ResumeServerData
    | CoverLetter
    | atsResult
    | GapResult
    | InterviewResult;
}

export const ItemRow = ({
  isPending,
  onSelect,
  isSelected,
  contentRef,
  type,
  recivedData,
}: Props) => {
  const [showDelete, setShowDelete] = useState(false);

  const linkHref = (() => {
    switch (type) {
      case "resume":
        return `/dashboard/resumes/editor?resumeId=${recivedData.id}`;
      case "letter":
        return `/dashboard/coverletters/editor?coverId=${recivedData.id}`;
      case "ats":
        return `/dashboard/ats/create?id=${recivedData.id}`;
      case "gap":
        return `/dashboard/gap/create?id=${recivedData.id}`;
      case "interview":
        return `/dashboard/interview/create?id=${recivedData.id}`;
      default:
        return "";
    }
  })();

  const printFn = useReactToPrint({
    contentRef: contentRef,
    documentTitle:
      recivedData.title || type === "resume" ? "Resume" : "Cover Letter",
  });

  const PreviewSection =
    type === "resume" ? (
      <div className="w-32 h-40 overflow-hidden border rounded">
        <ResumePreview
          resumeData={mapToResumeValues(recivedData as ResumeServerData)}
          className="transform scale-[0.2] origin-top-left w-[500%] h-[500%]"
          contentRef={contentRef}
        />
      </div>
    ) : type === "letter" ? (
      <div className="w-32 h-40 overflow-hidden border rounded">
        <CoverLetterPreview
          coverLetterData={mapToCoverLetterValues(recivedData as CoverLetter)}
          className="transform scale-[0.2] origin-top-left w-[500%] h-[500%]"
          contentRef={contentRef}
        />
      </div>
    ) : (
      <div className="overflow-hidden border rounded">
        <File className="size-8" />
      </div>
    );

  return (
    <TableRow
      style={{
        height: type === "resume" || type === "letter" ? "200px" : "100px",
      }}
    >
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          disabled={isPending}
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-4">
          <>{PreviewSection}</>
          <div>
            <h3 className="font-semibold">
              {recivedData.title || `Untitled ${type}`}
            </h3>
            {type === "resume" && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {(recivedData as ResumeServerData).description ||
                  "No description"}
              </p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>{formatDate(recivedData.updatedAt, "MMM d, yyyy")}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={linkHref}>
                <View className="mr-2 h-4 w-4" />
                View
              </Link>
            </DropdownMenuItem>
            {(type === "resume" || type === "letter") && (
              <DropdownMenuItem onClick={() => printFn()}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </DropdownMenuItem>
            )}
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
        id={recivedData.id}
        open={showDelete}
        onOpenChange={setShowDelete}
        type={type}
      />
    </TableRow>
  );
};
