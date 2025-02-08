"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { steps } from "@/components/main/Resume/steps";
import { Breadcrumbs } from "@/components/main/Resume/Breadcrumbs";
import { Footer } from "@/components/main/Resume/Footer";
import { ResumeValues } from "@/lib/validation";
import { PreviewSection } from "@/components/main/Resume/ResumePreview/PreviewSection";
import { cn, mapToResumeValues } from "@/lib/utils";
import { useAutoSaveResume } from "@/hooks/useAutoSaveResume";
import { useUnloadWarning } from "@/hooks/useUnloadWarning";
import { ResumeServerData } from "@/lib/types";

interface Props {
  resumeToEdit: ResumeServerData | null;
}

export const ResumeEditor = ({ resumeToEdit }: Props) => {
  const searchParams = useSearchParams();

  const [resumeData, setResumeData] = useState<ResumeValues>(
    resumeToEdit ? mapToResumeValues(resumeToEdit) : {}
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
    <div className="flex grow flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center bg-neutral-600 dark:bg-neutral-900 ">
        <h1 className="text-2xl font-bold text-white"> Design your resume</h1>
        <p className="text-sm text-neutral-200">
          Follow the steps to create your resume, Your progress will be saved
          automatically
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div
            className={cn(
              "w-full md:w-1/2 p-3 overflow-y-auto space-y-6 md:block px-6",
              showSmResumePreview && "hidden"
            )}
          >
            <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
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
          />
        </div>
      </main>
      <Footer
        isSaving={isSaving}
        currentStep={currentStep}
        setCurrentStep={setStep}
        setShowResumePreview={setShowResumePreview}
        showSmResumePreview={showSmResumePreview}
      />
    </div>
  );
};
