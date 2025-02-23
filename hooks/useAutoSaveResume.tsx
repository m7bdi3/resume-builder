import { ResumeValues } from "@/lib/validation";
import { useDebounce } from "./use-Debounce";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "./use-toast";
import { saveResume } from "@/actions/forms.actions";
import { Button } from "@/components/ui/button";
import { fileReplacer } from "@/lib/utils";
import { useResumeStore } from "./store/useResumeStore";

export const useAutoSaveResume = (resumeData: ResumeValues) => {
  const searchParams = useSearchParams();

  const { toast } = useToast();
  const debouncedResumeData = useDebounce(resumeData, 1500);

  const [resumeId, setResumeId] = useState(resumeData.id);
  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(resumeData)
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);
  const { addResume } = useResumeStore();
  useEffect(() => {
    setIsError(false);
  }, [debouncedResumeData]);

  useEffect(() => {
    async function save() {
      try {
        setIsSaving(true);
        setIsError(false);

        const newData = structuredClone(debouncedResumeData);

        const updatedResume = await saveResume({
          ...newData,
          ...(JSON.stringify(lastSavedData.img, fileReplacer) ===
            JSON.stringify(newData.img, fileReplacer) && {
            img: undefined,
          }),
          id: resumeId,
        });

        setResumeId(updatedResume?.id);
        setLastSavedData(newData);
        addResume(updatedResume);
        if (
          updatedResume &&
          searchParams.get("resumeId") !== updatedResume?.id
        ) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("resumeId", updatedResume.id);
          window.history.replaceState(
            null,
            "",
            `?${newSearchParams.toString()}`
          );
        }
      } catch (error) {
        setIsError(true);
        console.error(error);
        const { dismiss } = toast({
          variant: "destructive",
          description: (
            <div className="space-y-3">
              <p>Could not save changes</p>
              <Button
                variant={"secondary"}
                onClick={() => {
                  dismiss();
                  save();
                }}
              >
                Retry
              </Button>
            </div>
          ),
        });
      } finally {
        setIsSaving(false);
      }
    }

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData, fileReplacer) !==
      JSON.stringify(lastSavedData, fileReplacer);

    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError)
      save();
  }, [
    debouncedResumeData,
    isSaving,
    lastSavedData,
    isError,
    resumeId,
    searchParams,
    toast,
    addResume,
  ]);

  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
  };
};
