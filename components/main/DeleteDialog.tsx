"use client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoadingButton } from "@/components/main/LoadingButton";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  DeleteGap,
  DeleteResume,
  DeleteAts,
  DeleteInterview,
  DeleteCover,
} from "@/actions/prisma.actions";
import { useInterviewStore } from "@/hooks/store/useInterviewStore";
import { useResumeStore } from "@/hooks/store/useResumeStore";
import { useCoverStore } from "@/hooks/store/useCoverStore";
import { useAtsStore } from "@/hooks/store/useAtsStore";
import { useGapStore } from "@/hooks/store/useGapStore";

interface DeleteProps {
  id?: string;
  ids?: string[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect: () => void;
  type: "resume" | "letter" | "ats" | "gap" | "interview";
  onPending: (isPending: boolean) => void;
}

const typeLabels = {
  resume: "Resume",
  letter: "Cover Letter",
  ats: "ATS",
  gap: "Gap",
  interview: "Interview",
};

export const DeleteDialog = ({
  id,
  ids,
  type,
  open,
  onOpenChange,
  onSelect,
  onPending,
}: DeleteProps) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Store hooks
  const { deleteResume } = useResumeStore();
  const { deleteCover } = useCoverStore();
  const { deleteAts } = useAtsStore();
  const { deleteGap } = useGapStore();
  const { deleteInterview } = useInterviewStore();

  const getDeleteHandler = () => {
    switch (type) {
      case "resume":
        return { action: DeleteResume, store: deleteResume };
      case "letter":
        return { action: DeleteCover, store: deleteCover };
      case "ats":
        return { action: DeleteAts, store: deleteAts };
      case "gap":
        return { action: DeleteGap, store: deleteGap };
      case "interview":
        return { action: DeleteInterview, store: deleteInterview };
      default:
        throw new Error("Invalid delete type");
    }
  };

  async function handleDelete() {
    const selectedIds = ids?.length ? ids : id ? [id] : [];
    if (selectedIds.length === 0) return;

    const { action, store } = getDeleteHandler();
    const isBulkDelete = selectedIds.length > 1;

    onPending(true);
    startTransition(async () => {
      try {
        // Handle both single and bulk delete
        if (isBulkDelete) {
          await Promise.all(selectedIds.map((id) => action(id)));
          selectedIds.forEach((id) => store(id));
        } else {
          await action(selectedIds[0]);
          store(selectedIds[0]);
        }

        onOpenChange?.(false);
        onSelect();
        toast({
          description: isBulkDelete
            ? `${selectedIds.length} ${typeLabels[type]}s deleted successfully`
            : `${typeLabels[type]} deleted successfully`,
        });
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: `Failed to delete ${isBulkDelete ? "items" : typeLabels[type].toLowerCase()}`,
        });
      } finally {
        onPending(false);
      }
    });
  }

  const itemCount = ids?.length || (id ? 1 : 0);
  const isBulk = itemCount > 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!open && !onOpenChange && (
        <DialogTrigger asChild>
          <Button variant={"destructive"}>
            <Trash2 className="size-4" /> Delete
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {isBulk
              ? `Delete ${itemCount} ${typeLabels[type]}s`
              : `Delete ${typeLabels[type]}`}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            This will permanently delete{" "}
            {isBulk
              ? `${itemCount} ${typeLabels[type].toLowerCase()}s and all their data`
              : `this ${typeLabels[type].toLowerCase()} and all its data`}
            .
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>
            Cancel
          </Button>
          <LoadingButton
            variant="destructive"
            onClick={handleDelete}
            loading={isPending}
            disabled={!id && !ids?.length}
          >
            {isPending
              ? `Deleting${isBulk ? " Items..." : "..."}`
              : `${isBulk ? `Delete ${itemCount} Items` : "Delete"}`}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};