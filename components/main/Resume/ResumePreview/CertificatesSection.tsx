"use client";

import type React from "react";
import type { ResumeValues } from "@/lib/validation";
import { formatDate } from "date-fns";
import { SectionHeader } from "./SectionHeader";

interface Props {
  resumeData: ResumeValues;
}

export const CertificationsSection: React.FC<Props> = ({ resumeData }) => {
  const { certifications, colorHex } = resumeData;

  const certificationsNotEmpty = certifications?.filter(
    (cert) => Object.values(cert).filter(Boolean).length > 0
  );

  if (!certificationsNotEmpty?.length) return null;

  return (
    <section className="mb-8">
      <SectionHeader title="Certifications" colorHex={colorHex} />
      <div className="space-y-4">
        {certificationsNotEmpty.map((cert, index) => (
          <div key={index} className="break-inside-avoid">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
              <div className="flex-grow">
                <h3 className="font-bold text-lg" style={{ color: colorHex }}>
                  {cert.name}
                </h3>
                <p className="text-base text-gray-700">{cert.issuer}</p>
              </div>
              <div className="flex flex-col items-end mt-1 sm:mt-0">
                {cert.dateObtained && (
                  <span className="text-sm font-medium text-gray-600">
                    {formatDate(new Date(cert.dateObtained), "MMM yyyy")}
                  </span>
                )}
                {cert.credentialId && (
                  <span className="text-sm text-gray-600 mt-1">
                    ID: {cert.credentialId}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
