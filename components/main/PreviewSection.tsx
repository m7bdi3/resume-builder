import { CoverLetterValues, ResumeValues } from "@/lib/validation";
import React from "react";
import { ResumePreview } from "@/components/main/Resume/ResumePreview/ResumePreview";
import { ColorPicker } from "@/components/main/Resume/ColorPicker";
import { BorderStyleButton } from "@/components/main/Resume/BorderStyleButton";
import { cn } from "@/lib/utils";
import { CoverLetterPreview } from "@/components/main/coverLetter/CoverLetterPreview/CoverLetterPreview";

interface Props {
  resumeData?: ResumeValues;
  coverLetterData?: CoverLetterValues;
  setResumeData?: (data: ResumeValues) => void;
  className?: string;
  isResume: boolean;
}

export const PreviewSection = ({
  resumeData,
  coverLetterData,
  setResumeData,
  className,
  isResume,
}: Props) => {
  return (
    <div
      className={cn("group relative hidden w-full md:flex md:w-1/2", className)}
    >
      {isResume && (
        <div className="absolute left-1 top-1 flex flex-none flex-col gap-3 opacity-50 transition-opacity group-hover:opacity-100 lg:left-3 lg:top-3 xl:opacity-100">
          <ColorPicker
            color={resumeData?.colorHex}
            onChange={(color) => {
              if (setResumeData)
                setResumeData({
                  ...resumeData,
                  colorHex: color.hex,
                  coverLetters: resumeData?.coverLetters || [],
                });
            }}
          />
          <BorderStyleButton
            borderStyle={resumeData?.borderStyle}
            onChange={(borderStyle) => {
              if (setResumeData)
                setResumeData({
                  ...resumeData,
                  borderStyle,
                  coverLetters: resumeData?.coverLetters || [],
                });
            }}
          />
        </div>
      )}
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        {isResume ? (
          <ResumePreview
            resumeData={resumeData}
            className="max-w-2xl shadow-md"
          />
        ) : (
          <CoverLetterPreview
            coverLetterData={coverLetterData}
            className="max-w-2xl shadow-md"
          />
        )}
      </div>
    </div>
  );
};
