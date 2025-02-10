import { generateCover } from "@/actions/ai.actions";
import { useSubsLevel } from "@/app/(main)/SubsProvider";
import { LoadingButton } from "@/components/main/LoadingButton";
import { useToast } from "@/hooks/use-toast";
import usePremiumModal from "@/hooks/usePremiumModal";
import { canUseAiTools } from "@/lib/permissions";
import { CoverLetterValues } from "@/lib/validation";
import { WandSparkles } from "lucide-react";
import { useState } from "react";

interface Props {
  coverData: CoverLetterValues;
  onGenerated: (body: string) => void;
}

export const GenerateCoverButton = ({ coverData, onGenerated }: Props) => {
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
      const aiResponse = await generateCover(coverData);
      onGenerated(aiResponse);
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
      <WandSparkles className="size-4" /> Create using Ai
    </LoadingButton>
  );
};
