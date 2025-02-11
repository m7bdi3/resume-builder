"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { File, MoreVertical, Printer, Trash2, Edit } from "lucide-react";

import { useReactToPrint } from "react-to-print";
import { DeleteDialog } from "@/components/main/DeleteResumeDiaog";
import type { CoverLetterServerData } from "@/lib/types";

interface Props {
  coverLetter: CoverLetterServerData;
}

export const CoverLetterItem = ({ coverLetter }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: coverLetter.title || "Cover Letter",
  });

  return (
    <Card className="group relative border hover:border-primary/20 transition-colors shadow-sm hover:shadow-md overflow-hidden">
      <CardContent className="space-y-3 p-5">
        <div className="flex items-center justify-between">
          <File className="size-10 text-primary" />
          <DropMenu
            coverLetterId={coverLetter.id}
            onPrintClick={reactToPrintFn}
            resumeId={coverLetter.resumeId}
          />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-foreground text-lg line-clamp-2">
            {coverLetter.title || "Untitled Cover Letter"}
          </h3>
        </div>
      </CardContent>
    </Card>
  );
};

interface DropProps {
  coverLetterId: string;
  resumeId: string;
  onPrintClick: () => void;
}

const DropMenu = ({ coverLetterId, onPrintClick, resumeId }: DropProps) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="size-8 p-0 hover:bg-accent"
            aria-label="Cover Letter actions menu"
          >
            <MoreVertical className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link
              href={`/resumes/${resumeId}/coverletter/create?coverId=${coverLetterId}`}
            >
              <Edit className="size-4 mr-2" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem variant="default" onClick={onPrintClick}>
            <Printer className="size-4 mr-2" />
            Print
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteDialog
        id={coverLetterId}
        open={showDelete}
        onOpenChange={setShowDelete}
        isResume={false}
      />
    </>
  );
};
