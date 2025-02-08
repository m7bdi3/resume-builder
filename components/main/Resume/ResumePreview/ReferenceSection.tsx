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
    <section className="mb-4">
      <SectionHeader title="References" colorHex={colorHex} />
      <div className="space-y-4">
        {referencesNotEmpty.map((ref, index) => (
          <div key={index} className="break-inside-avoid">
            <div className="flex justify-between items-start">
              <p
                className="font-semibold text-base"
                style={{ color: colorHex }}
              >
                • {ref.name}
              </p>
              <p className="text-sm ml-1">{ref.phone}</p>
              <p className="text-sm ml-1">{ref.email}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
