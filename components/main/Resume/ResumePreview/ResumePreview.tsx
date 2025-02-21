"use client";

import { JSX, useRef } from "react";
import { cn } from "@/lib/utils";
import type { ResumeValues } from "@/lib/validation";
import useDimensions from "@/hooks/useDimensions";

interface Props {
  resumeData?: ResumeValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
  renderTemplate: () => JSX.Element;
}

export const ResumePreview: React.FC<Props> = ({
  resumeData,
  renderTemplate,
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
        className={cn(!width && "invisible")}
        style={{
          zoom: width ? (1 / 794) * width : 1,
        }}
      >
        {resumeData && renderTemplate()}
      </div>
    </div>
  );
};
