"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ResumeServerData } from "@/lib/types";
import { formatDate } from "date-fns";
import Link from "next/link";
import React, { useRef, useState, useTransition } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { DeleteResume } from "@/actions/forms.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LoadingButton } from "@/components/LoadingButton";
import { useReactToPrint } from "react-to-print";

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
    <Card className="group relative border-transparent hover:border-border transition-colors ">
      <CardHeader className="space-y-3">
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="inline-block w-full text-center"
        >
          <p className="line-clamp-1 font-semibold">
            {resume.title || "No Title"}
          </p>
          {resume.description && (
            <p className="line-clamp-2 text-muted-foreground">
              {resume.description}
            </p>
          )}
          <p className="text-xs">
            {wasUpdated ? "updated" : "create"} on{" "}
            {formatDate(resume.updatedAt, "MMM d, yyyy h:mm a")}
          </p>
        </Link>
      </CardHeader>
      <CardContent>
        <Link
          href={`/editor?resumeId=${resume.id}`}
          className="inline-block w-full relative"
        >
          <ResumePreview
            contentRef={contentRef}
            resumeData={mapToResumeValues(resume)}
            className="overflow-hidden shadow-sm group-hover:shadow-lg rounded-lg transition-shadow"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card  to-transparent" />
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
            variant={"ghost"}
            size={"icon"}
            className="absolute right-0.5 top-0.5 opacity-0 transition-opacity  group-hover:opacity-100"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={() => setShowDelete(!showDelete)}
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={onPrintClick}
          >
            <Printer className="size-4" />
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

interface DeleteProps {
  resumeId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DeleteDialog = ({ resumeId, onOpenChange, open }: DeleteProps) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      try {
        await DeleteResume(resumeId);
        onOpenChange(false);
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Something went wrong",
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive">Delete Resume?</DialogTitle>
          <DialogDescription className="">
            This action cannot be undone. This will permanently delete the
            resume and remove all of its data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant={"destructive"}
            onClick={handleDelete}
            loading={isPending}
          >
            Delete
          </LoadingButton>
          <Button
            variant={"secondary"}
            onClick={() => onOpenChange(!open)}
            autoFocus
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
