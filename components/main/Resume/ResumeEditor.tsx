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
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
      <header className="space-y-1.5 border-b px-3 py-5 text-center  bg-neutral-300 dark:bg-neutral-900 ">
        <h1 className="text-2xl font-bold"> Design your resume</h1>
        <p className="text-sm">
          Follow the steps to create your resume, Your progress will be saved
          automatically
        </p>
        <Breadcrumbs currentStep={currentStep} setCurrentStep={setStep} />
      </header>
      <main className="relative grow">
        <ResizablePanelGroup
          direction="horizontal"
          className="absolute bottom-0 top-0 flex w-full"
        >
          <ResizablePanel
            className={cn(
              "w-full md:w-1/2 p-6 md:block !overflow-y-auto",
              showSmResumePreview && "hidden"
            )}
            defaultSize={60}
          >
            {FormComponent && (
              <FormComponent
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            )}
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            className=" group relative hidden md:w-1/2 md:flex justify-center w-full !overflow-y-auto"
            defaultSize={40}
          >
            <PreviewSection
              resumeData={resumeData}
              setResumeData={setResumeData}
              className={cn(showSmResumePreview && "flex")}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
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
