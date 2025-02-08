import { generateWorkExperience } from "@/actions/ai.actions";
import { useSubsLevel } from "@/app/(main)/SubsProvider";
import { LoadingButton } from "@/components/main/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseAiTools } from "@/lib/permissions";
import {
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  onWorkExperienceGenerated: (WorkExperience: WorkExperience) => void;
}

export const GenerateWorkExperienceButton = ({
  onWorkExperienceGenerated,
}: Props) => {
  const [showInputDialog, setShowInputDialog] = useState(false);
  const subLevel = useSubsLevel();
  const { open, setOpen } = usePremiumModal();

  return (
    <>
      <Button
        variant={"outline"}
        type="button"
        onClick={() => {
          if (!canUseAiTools(subLevel)) {
            setOpen(!open);
            return;
          }
          setShowInputDialog(!showInputDialog);
        }}
      >
        <WandSparkles className="size-4" /> Smart Fill Ai
      </Button>
      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        onWorkExperienceGenerated={(WorkExperience) => {
          onWorkExperienceGenerated(WorkExperience);
          setShowInputDialog(false);
        }}
      />
    </>
  );
};

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkExperienceGenerated: (WorkExperience: WorkExperience) => void;
}

const InputDialog = ({
  open,
  onOpenChange,
  onWorkExperienceGenerated,
}: DialogProps) => {
  const { toast } = useToast();

  const form = useForm<GenerateWorkExperienceInput>({
    resolver: zodResolver(generateWorkExperienceSchema),
    defaultValues: {
      description: "",
    },
  });

  async function onSubmit(input: GenerateWorkExperienceInput) {
    try {
      const res = await generateWorkExperience(input);
      onWorkExperienceGenerated(res);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate work experience</DialogTitle>
          <DialogDescription>
            Describe this work experience and the Ai will generate an optimized
            entry for you
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`E.g. "From nov 2019 to dec 2022 i worked at google as a software engineer and my tasks were: ...."`}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={form.formState.isSubmitting}>
              Generate
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
