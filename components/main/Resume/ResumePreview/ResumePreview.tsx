import { useRef } from "react";

import { cn } from "@/lib/utils";

import type { ResumeValues } from "@/lib/validation";

import useDimensions from "@/hooks/useDimensions";

import { PersonalInfoHeader } from "@/components/main/Resume/ResumePreview/PersonalInfoHeader";
import { SummarySection } from "@/components/main/Resume/ResumePreview/SummarySection";
import { WorkExperienceSection } from "@/components/main/Resume/ResumePreview/WorkExperienceSection";
import { EducationSection } from "@/components/main/Resume/ResumePreview/EducationSection";
import { SkillsSection } from "@/components/main/Resume/ResumePreview/SkillsSection";

interface Props {
  resumeData: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export const ResumePreview: React.FC<Props> = ({
  resumeData,
  contentRef,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef as React.RefObject<HTMLElement>);

  return (
    <div
      className={cn(
        "bg-white text-black h-fit w-full aspect-[210/297]",
        className
      )}
      ref={containerRef}
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{
          zoom: width ? (1 / 794) * width : 1,
        }}
        ref={contentRef}
        id="resumePreviewContent"
      >
        <PersonalInfoHeader resumeData={resumeData} />
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        <EducationSection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
      </div>
    </div>
  );
};
