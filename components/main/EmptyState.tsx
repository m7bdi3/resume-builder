import { FilePen } from "lucide-react";
import { CreateResumeButton } from "../premium/CreateResumeButton";
import { CreateCoverLetterButton } from "../premium/CreateCoverLetterButton";
import { CreateAtsButton } from "../premium/CreateAtsButton";
import { CreateGapButton } from "../premium/CreateGapButton";
import { CreateInterviewButton } from "../premium/CreateInterviewButton";

interface Props {
  type: "resume" | "letter" | "ats" | "gap" | "interview";
}

export function EmptyState({ type }: Props) {
  const getStateHandler = () => {
    switch (type) {
      case "resume":
        return <CreateResumeButton />;
      case "letter":
        return <CreateCoverLetterButton />;
      case "ats":
        return <CreateAtsButton />;
      case "gap":
        return <CreateGapButton />;
      case "interview":
        return <CreateInterviewButton />;
      default:
        throw new Error("Invalid state type");
    }
  };
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-[50vh] text-center">
      <FilePen className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold">No {type.toUpperCase()} found</h3>
        <p className="text-sm text-muted-foreground">
          Get started by creating a new {type.toUpperCase()}
        </p>
      </div>
      {getStateHandler()}
    </div>
  );
}
