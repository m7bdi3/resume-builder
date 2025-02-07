"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ResumeServerData } from "@/lib/types";
import { formatDate } from "date-fns";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { ResumePreview } from "./ResumePreview/ResumePreview";
import { mapToResumeValues } from "@/lib/utils";
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
    <Card className="group relative border hover:border-primary/20 transition-colors shadow-sm hover:shadow-md max-h-[400px] overflow-hidden">
      <CardHeader className="space-y-2 p-4 pb-2">
        <div className="flex flex-col gap-1">
          <Link
            href={`/editor?resumeId=${resume.id}`}
            className="inline-block w-full"
          >
            <h3 className="line-clamp-1 font-semibold text-foreground text-lg">
              {resume.title || "Untitled Resume"}
            </h3>

            <p className="line-clamp-2 text-sm text-muted-foreground">
              {resume.description || (
                <span>
                  <br />
                </span>
              )}
            </p>
          </Link>
          <p className="text-xs text-muted-foreground mt-2">
            {wasUpdated ? "Updated" : "Created"} •{" "}
            {formatDate(resume.updatedAt, "MMM d, yyyy")}
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 overflow-hidden">
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="inline-block w-full relative"
        >
          <ResumePreview
            contentRef={contentRef}
            resumeData={mapToResumeValues(resume)}
            className="overflow-hidden rounded-lg border"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card/80 to-transparent" />
        </Link>
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
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 size-8 p-0 rounded-full bg-card/90 backdrop-blur-sm hover:bg-accent"
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
        resumeId={resumeId}
        open={showDelete}
        onOpenChange={setShowDelete}
      />
    </>
  );
};
