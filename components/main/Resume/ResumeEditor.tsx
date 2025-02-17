"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { steps } from "@/lib/steps";

import { ResumeValues } from "@/lib/validation";
import { PreviewSection } from "@/components/main/PreviewSection";
import { cn, mapToResumeValues } from "@/lib/utils";
import { useAutoSaveResume } from "@/hooks/useAutoSaveResume";
import { useUnloadWarning } from "@/hooks/useUnloadWarning";
import { ResumeServerData } from "@/lib/types";
import { Footer } from "@/components/main/Resume/Footer";
import { Breadcrumbs } from "@/components/main/Breadcrumbs";

interface Props {
  resumeToEdit: ResumeServerData | null;
}

export const ResumeEditor = ({ resumeToEdit }: Props) => {
  const searchParams = useSearchParams();

  const [resumeData, setResumeData] = useState<ResumeValues>(
    resumeToEdit ? mapToResumeValues(resumeToEdit) : ({} as ResumeValues)
  );

  const [showSmResumePreview, setShowResumePreview] = useState(false);

  const { isSaving, hasUnsavedChanges } = useAutoSaveResume(resumeData);
  useUnloadWarning(hasUnsavedChanges);

  const currentStep = searchParams.get("step") || steps[0].key;

  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }

  const FormComponent = steps.find(
    (step) => step.key === currentStep
  )?.component;

  return (
    <div className="flex grow flex-col size-full">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <h1 className="text-2xl font-bold">Design your resume</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to create your resume. Your progress will be
          saved automatically.
        </p>
      </header>
      <main className="relative grow size-full">
        <div className="absolute bottom-0 top-0 flex size-full">
          <div
            className={cn(
              "w-full space-y-6 overflow-y-auto p-3 md:block md:w-1/2",
              showSmResumePreview && "hidden"
            )}
          >
            <Breadcrumbs
              currentStep={currentStep}
              setCurrentStep={setStep}
              resumeSteps
            />
            {FormComponent && (
              <FormComponent
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
          </div>
          <div className="grow md:border-r" />
          <PreviewSection
            resumeData={resumeData}
            setResumeData={setResumeData}
            className={cn(showSmResumePreview && "flex")}
            isResume
          />
        </div>
      </main>
      <Footer
        currentStep={currentStep}
        setCurrentStep={setStep}
        showSmResumePreview={showSmResumePreview}
        setShowResumePreview={setShowResumePreview}
        isSaving={isSaving}
      />
    </div>
  );
};
