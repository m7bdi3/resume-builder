"use client";
import { useToast } from "@/hooks/use-toast";
import { DeleteCoverLetter, DeleteResume } from "@/actions/forms.actions";
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
import { useResumeStore } from "@/hooks/store/useResumeStore";
import { useCoverStore } from "@/hooks/store/useCoverStore";

interface DeleteProps {
  id: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isResume: boolean;
}

export const DeleteDialog = ({
  id,
  onOpenChange,
  open,
  isResume,
}: DeleteProps) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const { deleteResume } = useResumeStore();
  const { deleteCover } = useCoverStore();

  async function handleDelete() {
    startTransition(async () => {
      try {
        if (isResume) {
          await DeleteResume(id);
          deleteResume(id);
        } else {
          await DeleteCoverLetter(id);
          deleteCover(id);
        }
        if (onOpenChange) onOpenChange(false);
        if (isResume) {
          toast({ description: "Resume deleted successfully" });
        } else {
          toast({ description: "Cover Letter deleted successfully" });
        }
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Failed to delete.",
        });
      }
    });
  }

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
            Delete {isResume ? "Resume" : "Cover Letter"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            This will permanently delete this document and all its data.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              if (onOpenChange) onOpenChange(false);
            }}
            className="ring-offset-background focus-visible:ring-2 focus-visible:ring-primary"
          >
            Cancel
          </Button>
          <LoadingButton
            variant="destructive"
            onClick={handleDelete}
            loading={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
