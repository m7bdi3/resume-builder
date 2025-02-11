"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ResumeServerData } from "@/lib/types";
import { formatDate } from "date-fns";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { ResumePreview } from "@/components/main/Resume/ResumePreview/ResumePreview";
import { mapToResumeValues } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Printer, Trash2 } from "lucide-react";

import { useReactToPrint } from "react-to-print";
import { DeleteDialog } from "@/components/main/DeleteResumeDiaog";

interface Props {
  resume: ResumeServerData;
}

export const ResumeItem = ({ resume }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: resume.title || "Resume",
  });

  const wasUpdated = resume.updatedAt !== resume.createdAt;

  return (
    <Card className="relative border hover:border-primary/20 transition-colors shadow-sm hover:shadow-md max-h-[400px] overflow-hidden">
      <CardHeader className="space-y-2 p-4 pb-2">
        <div className="flex flex-col gap-1">
          <h3 className="line-clamp-1 font-semibold text-foreground text-lg capitalize">
            {resume.title || "Untitled Resume"}
          </h3>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {resume.description || (
              <span>
                <br />
              </span>
            )}
          </p>
          <p className="text-xs text-muted-foreground mt-2 self-end">
            {wasUpdated ? "Updated" : "Created"} •{" "}
            {formatDate(resume.updatedAt, "MMM d, yyyy")}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 overflow-hidden">
        <Link href={`/resumes/${resume.id}`} className="inline-block w-full">
          <ResumePreview
            contentRef={contentRef}
            resumeData={mapToResumeValues(resume)}
            className="overflow-hidden rounded-lg border"
          />
        </Link>
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/80 to-transparent" />
      </CardContent>

      <DropMenu resumeId={resume.id} onPrintClick={reactToPrintFn} />
    </Card>
  );
};

interface DropProps {
  resumeId: string;
  onPrintClick: () => void;
}

const DropMenu = ({ resumeId, onPrintClick }: DropProps) => {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="group absolute right-2 top-2 size-8 cursor-pointer hover:bg-accent/60 backdrop-blur-sm flex items-center justify-center rounded">
          <MoreVertical className="size-4 text-muted-foreground group-hover:text-accent-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onPrintClick} variant="default">
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
        id={resumeId}
        open={showDelete}
        onOpenChange={setShowDelete}
        isResume
      />
    </>
  );
};
