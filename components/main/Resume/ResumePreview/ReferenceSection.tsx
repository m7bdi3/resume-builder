"use client";

import type React from "react";
import type { ResumeValues } from "@/lib/validation";
import { SectionHeader } from "./SectionHeader";

interface Props {
  resumeData: ResumeValues;
}

export const ReferenceSection: React.FC<Props> = ({ resumeData }) => {
  const { references, colorHex } = resumeData;

  const referencesNotEmpty = references?.filter(
    (ref) => Object.values(ref).filter(Boolean).length > 0
  );

  if (!referencesNotEmpty?.length) return null;

  return (
    <section className="mb-8">
      <SectionHeader title="References" colorHex={colorHex} />
      <div className="">
        {referencesNotEmpty.map((ref, index) => (
          <div
            key={index}
            className="break-inside-avoid flex items-center justify-between"
          >
            <h3 className="font-bold text-lg mb-2" style={{ color: colorHex }}>
              {ref.name}
            </h3>

            {ref.phone && (
              <div className="flex items-center text-sm text-gray-700">
                {ref.phone}
              </div>
            )}
            {ref.email && (
              <div className="flex items-center text-sm text-gray-700">
                {ref.email}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
