"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ResumeValues } from "@/lib/validation";
import { BorderStyles } from "@/components/main/Resume/BorderStyleButton";

interface Props {
  resumeData: ResumeValues;
}

export const PersonalInfoHeader: React.FC<Props> = ({ resumeData }) => {
  const {
    firstName,
    lastName,
    img,
    jobTitle,
    country,
    city,
    phone,
    email,
    colorHex,
    borderStyle,
    linkedInUrl,
    githubUrl,
    websiteUrl,
  } = resumeData;

  const [imgSrc, setImgSrc] = useState<string>(
    img instanceof File ? "" : img || ""
  );

  useEffect(() => {
    if (img instanceof File) {
      const objectUrl = URL.createObjectURL(img);
      setImgSrc(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (img === null) {
      setImgSrc("");
    }
  }, [img]);

  const socialLinks = [
    { url: linkedInUrl, label: "LinkedIn" },
    { url: githubUrl, label: "GitHub" },
    { url: websiteUrl, label: "Website" },
  ].filter((link) => link.url);

  return (
    <header className="flex items-start gap-6  py-2">
      {imgSrc && (
        <Image
          src={imgSrc || "/placeholder.svg"}
          alt={`${firstName || "Author"}'s photo`}
          width={120}
          height={120}
          style={{
            borderRadius:
              borderStyle === BorderStyles.SQUARE
                ? "0px"
                : borderStyle === BorderStyles.CIRCLE
                  ? "50%"
                  : "10%",
            borderColor: colorHex,
            borderWidth: "2px",
          }}
          className="aspect-square object-cover shadow-md"
        />
      )}
      <div className="flex flex-col items-center md:items-start space-y-3 flex-grow">
        <div className="text-center md:text-left">
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ color: colorHex }}
          >
            {firstName} {lastName}
          </h1>
          <h2 className="text-2xl font-semibold mt-1 text-gray-700">
            {jobTitle}
          </h2>
        </div>
        <div className="text-sm text-gray-600 flex flex-wrap justify-center md:justify-start gap-2">
          {[city, country, phone, email].filter(Boolean).map((item, index) => (
            <span key={index} className="flex items-center">
              {item}
              {index < 3 && <span className="mx-2 text-gray-400">•</span>}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-2">
          {socialLinks.map((item, index) => (
            <Link
              key={index}
              href={item.url ?? ""}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};
