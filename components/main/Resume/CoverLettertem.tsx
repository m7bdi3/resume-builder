"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CoverLetterServerData } from "@/lib/types";
import { formatDate } from "date-fns";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { mapToCoverLetterValues } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Printer, Trash2 } from "lucide-react";

import { useReactToPrint } from "react-to-print";
import { DeleteDialog } from "./DeleteResumeDiaog";
import { CoverLetterPreview } from "./ResumePreview/CoverLetterPreview";

interface Props {
  coverLetter: CoverLetterServerData;
}

export const CoverLetterItem = ({ coverLetter }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: coverLetter.title || "Cover Letter",
  });

  const wasUpdated = coverLetter.updatedAt !== coverLetter.createdAt;

  return (
    <Link
      href={`/coverletter/create?coverId=${coverLetter.id}`}
      className="inline-block w-full"
    >
      <Card className="group relative border hover:border-primary/20 transition-colors shadow-sm hover:shadow-md max-h-[400px] overflow-hidden">
        <CardHeader className="space-y-2 p-4 pb-2">
          <div className="flex flex-col gap-1">
            <h3 className="line-clamp-1 font-semibold text-foreground text-lg">
              {coverLetter.title || "Untitled Resume"}
            </h3>

            <p className="text-xs text-muted-foreground mt-2">
              {wasUpdated ? "Updated" : "Created"} •{" "}
              {formatDate(coverLetter.updatedAt, "MMM d, yyyy")}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-0 overflow-hidden">
          <CoverLetterPreview
            contentRef={contentRef}
            coverLetterData={mapToCoverLetterValues(coverLetter)}
            className="overflow-hidden rounded-lg border"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/80 to-transparent" />
        </CardContent>

        <DropMenu
          coverLetterId={coverLetter.id}
          onPrintClick={reactToPrintFn}
        />
      </Card>
    </Link>
  );
};

interface DropProps {
  coverLetterId: string;
  onPrintClick: () => void;
}

const DropMenu = ({ coverLetterId, onPrintClick }: DropProps) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 size-8 p-0 bg-card/90 backdrop-blur-sm hover:bg-accent"
            aria-label="Resume actions menu"
          >
            <MoreVertical className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive-foreground focus:bg-destructive/10"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-muted-foreground"
            onClick={onPrintClick}
          >
            <Printer className="size-4 mr-2" />
            Print
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
