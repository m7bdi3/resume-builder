import { CoverLetterValues } from "@/lib/validation";
import { useDebounce } from "./use-Debounce";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "./use-toast";
import { saveCover } from "@/actions/forms.actions";
import { Button } from "@/components/ui/button";
import { fileReplacer } from "@/lib/utils";

export const useAutoSaveCover = (
  coverData: CoverLetterValues,
  resumeId: string
) => {
  const searchParams = useSearchParams();

  const { toast } = useToast();
  const debouncedResumeData = useDebounce(coverData, 1500);

  const [coverId, setCoverId] = useState(coverData.id);

  const [lastSavedData, setLastSavedData] = useState(
    structuredClone(coverData)
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsError(false);
  }, [debouncedResumeData]);

  useEffect(() => {
    async function save() {
      try {
        setIsSaving(true);
        setIsError(false);

        const newData = structuredClone(debouncedResumeData);

        const updatedCover = await saveCover(
          {
            ...newData,
            id: coverId,
          },
          resumeId
        );
        setCoverId(updatedCover.id);
        setLastSavedData(newData);

        if (searchParams.get("coverId") !== updatedCover.id) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("coverId", updatedCover.id);
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
    coverId,
    searchParams,
    toast,
    resumeId,
  ]);

  return {
    isSaving,
    hasUnsavedChanges:
      JSON.stringify(coverData) !== JSON.stringify(lastSavedData),
  };
};
