import { generateSummary } from "@/actions/ai.actions";
import { useSubsLevel } from "@/app/(main)/SubsProvider";
import { LoadingButton } from "@/components/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseAiTools } from "@/lib/permissions";
import { ResumeValues } from "@/lib/validation";
import { WandSparkles } from "lucide-react";
import { useState } from "react";

interface Props {
  resumeData: ResumeValues;
  onSummaryGenerated: (summary: string) => void;
}

export const GenerateSummaryButton = ({
  resumeData,
  onSummaryGenerated,
}: Props) => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const subLevel = useSubsLevel();
  const { open, setOpen } = usePremiumModal();

  const handleClick = async () => {
    if (!canUseAiTools(subLevel)) {
      setOpen(!open);
      return;
    }
    try {
      setLoading(true);
      const aiResponse = await generateSummary(resumeData);
      onSummaryGenerated(aiResponse);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <LoadingButton
      loading={loading}
      variant={"outline"}
      type="button"
      onClick={handleClick}
    >
      <WandSparkles className="size-4" /> Generate Ai
    </LoadingButton>
  );
};
