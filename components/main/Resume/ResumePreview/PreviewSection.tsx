import { ResumeValues } from "@/lib/validation";
import React from "react";
import { ResumePreview } from "./ResumePreview";
import { ColorPicker } from "../ColorPicker";
import { BorderStyleButton } from "../BorderStyleButton";
import { cn } from "@/lib/utils";

interface Props {
  resumeData: ResumeValues;
  setResumeData: (data: ResumeValues) => void;
  className?: string;
}

export const PreviewSection = ({
  resumeData,
  setResumeData,
  className,
}: Props) => {
  return (
    <div
      className={cn(
        " group relative hidden md:w-1/2 md:flex w-full",
        className
      )}
    >
      <div className="opacity-30 xl:opacity-100 group-hover:opacity-100 transition-opacity delay-200 absolute left-1 top-1 flex flex-col gap-3 flex-none lg:left-3 lg:top-3">
        <ColorPicker
          color={resumeData.colorHex}
          onChange={(color) =>
            setResumeData({ ...resumeData, colorHex: color.hex })
          }
        />
        <BorderStyleButton
          borderStyle={resumeData.borderStyle}
          onChange={(borderStyle) =>
            setResumeData({
              ...resumeData,
              borderStyle,
            })
          }
        />
      </div>
      <div className="flex w-full justify-center overflow-y-auto bg-secondary p-3">
        <ResumePreview
          resumeData={resumeData}
          className="max-w-2xl shadow-md"
        />
      </div>
    </div>
  );
};
