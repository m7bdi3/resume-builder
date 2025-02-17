import { generateCover } from "@/actions/ai.actions";

import { LoadingButton } from "@/components/main/LoadingButton";
import { useToast } from "@/hooks/use-toast";

import { CoverLetterValues, ResumeValues } from "@/lib/validation";
import { WandSparkles } from "lucide-react";
import { useState } from "react";

interface Props {
  coverData: CoverLetterValues;
  resumeData?: ResumeValues;
  onGenerated: (body: string) => void;
}

export const GenerateCoverButton = ({
  coverData,
  onGenerated,
  resumeData,
}: Props) => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const aiResponse = await generateCover(
        coverData,
        resumeData ?? undefined
      );
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
