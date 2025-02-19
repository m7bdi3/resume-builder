import { generateSkills } from "@/actions/ai.actions";
import { LoadingButton } from "@/components/main/LoadingButton";
import { useToast } from "@/hooks/use-toast";

import { ResumeValues } from "@/lib/validation";
import { WandSparkles } from "lucide-react";
import { useState } from "react";

interface Props {
  resumeData: ResumeValues;
  onSkillsGenerated: (skills: {
    softSkills: string[];
    technicalSkills: string[];
  }) => void;
}

export const GenerateSkillsButton = ({
  resumeData,
  onSkillsGenerated,
}: Props) => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const aiResponse = await generateSkills(resumeData);
      onSkillsGenerated(aiResponse);
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
