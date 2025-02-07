"use client";
import { useToast } from "@/hooks/use-toast";
import { DeleteResume } from "@/actions/forms.actions";
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

interface DeleteProps {
  resumeId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const DeleteDialog = ({ resumeId, onOpenChange, open }: DeleteProps) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      try {
        await DeleteResume(resumeId);
        if (onOpenChange) onOpenChange(false);
        toast({ description: "Resume deleted successfully" });
      } catch (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Failed to delete resume",
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {!open && !onOpenChange && (
        <DialogTrigger asChild>
          <Button variant={"destructive"} >
            <Trash2 className="size-5" /> Delete
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Delete Resume</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            This will permanently delete this resume and all its data.
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
