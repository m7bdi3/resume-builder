"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { steps } from "@/lib/steps";
import { Breadcrumbs } from "@/components/main/Resume/Breadcrumbs";
import { Footer } from "@/components/main/Resume/Footer";
import { CoverLetterValues } from "@/lib/validation";
import { PreviewSection } from "@/components/main/Resume/ResumePreview/PreviewSection";
import { cn, mapToCoverLetterValues, mapToResumeValues } from "@/lib/utils";
import { useUnloadWarning } from "@/hooks/useUnloadWarning";
import { CoverLetterServerData, ResumeServerData } from "@/lib/types";
import { Coversteps } from "@/lib/Coversteps";
import { useAutoSaveCover } from "@/hooks/useAutoSaveCover";

interface Props {
  coverLetterToEdit: CoverLetterServerData | null;
  resume: ResumeServerData | null;
}

export const CoverLetterEditor = ({ coverLetterToEdit, resume }: Props) => {
  const searchParams = useSearchParams();

  const resumeData = resume ? mapToResumeValues(resume) : { coverLetters: [] };

  const [coverLetterData, setCoverLetterData] = useState(
    coverLetterToEdit
      ? mapToCoverLetterValues(coverLetterToEdit)
      : ({} as CoverLetterValues)
  );

  const [showSmResumePreview, setShowResumePreview] = useState(false);

  const { isSaving, hasUnsavedChanges } = useAutoSaveCover(
    coverLetterData,
    resumeData.id!
  );
  useUnloadWarning(hasUnsavedChanges);

  const currentStep = searchParams.get("step") || steps[0].key;

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  const FormComponent = Coversteps.find(
    (step) => step.key === currentStep
  )?.component;

  return (
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design your Cover Letter</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to create your cover letter. Your progress will
          be saved automatically.
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div
            className={cn(
              "w-full space-y-6 overflow-y-auto p-3 md:block md:w-1/2",
              showSmResumePreview && "hidden"
            )}
          >
            <Breadcrumbs
              currentStep={currentStep}
              setCurrentStep={setStep}
              resumeSteps={false}
            />
            {FormComponent && (
              <FormComponent
                coverData={coverLetterData}
                setCoverData={setCoverLetterData}
                resumeData={resumeData}
              />
            )}
          </div>
          <div className="grow md:border-r" />
          <PreviewSection
            coverLetterData={coverLetterData}
            className={cn(showSmResumePreview && "flex")}
            isResume={false}
          />
        </div>
      </main>
      <Footer
        currentStep={currentStep}
        setCurrentStep={setStep}
        showSmResumePreview={showSmResumePreview}
        setShowResumePreview={setShowResumePreview}
        isSaving={isSaving}
        isResume={false}
        resumeId={resumeData.id!}
      />
    </div>
  );
};
