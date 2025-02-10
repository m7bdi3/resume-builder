"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import type { CoverLetterValues } from "@/lib/validation";
import useDimensions from "@/hooks/useDimensions";

interface Props {
  coverLetterData?: CoverLetterValues;
  contentRef?: React.Ref<HTMLDivElement>;
  className?: string;
}

export const CoverLetterPreview: React.FC<Props> = ({
  coverLetterData,
  contentRef,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef as React.RefObject<HTMLElement>);
  if (!coverLetterData) {
    return null;
  }

  const { firstName, lastName, jobTitle, body, phone, email } = coverLetterData;

  return (
    <div
      className={cn(
        "bg-white text-black h-fit w-full aspect-[210/297] shadow-md",
        className
      )}
      ref={containerRef}
    >
      <div
        className={cn("space-y-6 p-12", !width && "invisible")}
        style={{
          zoom: width ? (1 / 794) * width : 1,
        }}
        ref={contentRef}
        id="coverLetterPreviewContent"
      >
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{`${firstName ?? ""} ${lastName ?? ""}`}</h1>
          <p className="text-lg text-gray-600">{jobTitle ?? ""}</p>
          <p className="text-sm">{phone ?? ""}</p>
          <p className="text-sm">{email ?? ""}</p>
        </div>

        <div className="border-t border-gray-300 pt-6">
          <div dangerouslySetInnerHTML={{ __html: body ?? "" }} />
        </div>

        <div className="mt-8">
          <p className="text-sm">Sincerely,</p>
          <p className="text-lg font-semibold mt-4">{`${firstName ?? ""} ${lastName ?? ""}`}</p>
        </div>
      </div>
    </div>
  );
};
