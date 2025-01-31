import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { steps } from "./steps";
import { FileUser, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  isSaving: boolean;
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showSmResumePreview: boolean;
  setShowResumePreview: (show: boolean) => void;
}

export const Footer = ({
  isSaving,
  currentStep,
  setCurrentStep,
  showSmResumePreview,
  setShowResumePreview,
}: Props) => {
  const previousStep = steps.find(
    (_, index) => steps[index + 1]?.key === currentStep
  )?.key;

  const nextStep = steps.find(
    (_, index) => steps[index - 1]?.key === currentStep
  )?.key;

  return (
    <footer className="w-full border-t px-3 py-5">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant={"secondary"}
            onClick={
              previousStep ? () => setCurrentStep(previousStep) : undefined
            }
            disabled={!previousStep}
          >
            Previous step
          </Button>
          <Button
            onClick={nextStep ? () => setCurrentStep(nextStep) : undefined}
            disabled={!nextStep}
          >
            Next step
          </Button>
        </div>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => setShowResumePreview(!showSmResumePreview)}
          className="md:hidden"
          title={
            showSmResumePreview ? "Show Input Form" : "Show Resume Preview"
          }
        >
          {showSmResumePreview ? <PenLine /> : <FileUser />}
        </Button>
        <div className="flex items-center gap-3">
          <Button asChild>
            <Link href={"/resumes"}>Close</Link>
          </Button>
          <p
            className={cn(
              "text-muted-foreground opacity-0",
              isSaving && "opacity-100"
            )}
          >
            Saving...
          </p>
        </div>
      </div>
    </footer>
  );
};
