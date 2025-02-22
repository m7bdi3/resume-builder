"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import useDimensions from "@/hooks/useDimensions";
import { ResumeValues } from "@/lib/validation";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import ModernAsymmetric from "./templates/modern-asymmetric";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ProfessionalTemplate } from "./templates/ProfessionalTemplate";
import ElegantCentered from "./templates/elegant-centered";
import BoldHeader from "./templates/bold-header";
import MinimalistBlocks from "./templates/minimalist-blocks";

interface Props {
  resumeData: ResumeValues | undefined;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export const ResumePreview: React.FC<Props> = ({ resumeData, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef as React.RefObject<HTMLElement>);

  const renderTemplate = () => {
    switch (resumeData?.template) {
      case "CLASSIC":
        return <ClassicTemplate resumeData={resumeData} />;
      case "MODERN":
        return <ModernAsymmetric resumeData={resumeData} />;
      case "MINIMAL":
        return <ModernTemplate resumeData={resumeData} />;
      case "PROFESSIONAL":
        return <ProfessionalTemplate resumeData={resumeData} />;
      case "ELEGANT":
        return <ElegantCentered resumeData={resumeData} />;
      case "BOLDHEADER":
        return <BoldHeader resumeData={resumeData} />;
      case "BLOCKS":
        return <MinimalistBlocks resumeData={resumeData} />;
      default:
        return <ClassicTemplate resumeData={resumeData!} />;
    }
  };
  return (
    <div
      className={cn(
        "bg-white text-black h-fit w-full aspect-[210/297]",
        className
      )}
      ref={containerRef}
    >
      <div
        className={cn(!width && "invisible")}
        style={{
          zoom: width ? (1 / 794) * width : 1,
        }}
      >
        {renderTemplate()}
      </div>
    </div>
  );
};
