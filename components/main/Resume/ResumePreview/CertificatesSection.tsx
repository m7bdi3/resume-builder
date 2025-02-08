import type React from "react";
import type { ResumeValues } from "@/lib/validation";
import { formatDate } from "date-fns";
import { SectionHeader } from "./SectionHeader";

interface Props {
  resumeData: ResumeValues;
}

export const CertificatedSection: React.FC<Props> = ({ resumeData }) => {
  const { certifications, colorHex } = resumeData;

  const certificationsNotEmpty = certifications?.filter(
    (cert) => Object.values(cert).filter(Boolean).length > 0
  );

  if (!certificationsNotEmpty?.length) return null;

  return (
    <section className="mb-4">
      <SectionHeader title="Certificates" colorHex={colorHex} />
      <div className="space-y-4">
        {certificationsNotEmpty.map((cert, index) => (
          <div key={index} className="break-inside-avoid">
            <div className="flex justify-between items-start">
              <div className="">
                <p
                  className="font-semibold text-base"
                  style={{ color: colorHex }}
                >
                  • {cert.name}
                </p>
                <p className="text-sm ml-1">{cert.issuer}</p>
              </div>
              {cert.dateObtained && (
                <span className="text-sm text-gray-600">
                  {formatDate(cert.dateObtained, "MM/yyyy")}
                </span>
              )}
              <p className="text-sm ml-1">{cert.credentialId}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
