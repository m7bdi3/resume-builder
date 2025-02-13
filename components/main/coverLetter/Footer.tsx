import Link from "next/link";
import { FileUser, PenLine } from "lucide-react";
import { FooterProps } from "@/lib/types";
import { steps } from "@/lib/steps";
import { Button } from "@/components/ui/button";

export const Footer = ({
  isSaving,
  currentStep,
  setCurrentStep,
  showSmResumePreview,
  setShowResumePreview,
  isResume,
  resumeId,
}: FooterProps) => {
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
            <Link
              href={
                isResume
                  ? "/dashboard/resumes"
                  : `/dashboard/resumes/${resumeId}`
              }
            >
              {isSaving ? "Saving..." : "Close"}
            </Link>
          </Button>
        </div>
      </div>
    </footer>
  );
};
