import type React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { ResumeValues } from "@/lib/validation";
import { BorderStyles } from "../BorderStyleButton";
import Link from "next/link";

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

  const [imgSrc, setImgSrc] = useState(img instanceof File ? "" : img);

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
    <header className="flex items-center gap-6 mb-4">
      {imgSrc && (
        <Image
          src={imgSrc || "/placeholder.svg"}
          alt={`${firstName || "Author"}'s photo`}
          width={100}
          height={100}
          style={{
            borderRadius:
              borderStyle === BorderStyles.SQUARE
                ? "0px"
                : borderStyle === BorderStyles.CIRCLE
                  ? "99999px"
                  : "10%",
          }}
          className="aspect-square object-cover"
        />
      )}
      <div className="space-y-2.5">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold" style={{ color: colorHex }}>
            {firstName} {lastName}
          </h1>
          <h2 className="font-medium text-xl" style={{ color: colorHex }}>
            {jobTitle}
          </h2>
        </div>
        <div className="text-sm text-gray-600">
          {[city, country, phone, email].filter(Boolean).map((item, index) => (
            <span key={index} className="mr-2">
              {item}
              {index < 3 && " •"}
            </span>
          ))}
        </div>
        <div className="text-sm text-gray-600">
          {socialLinks.map((item, index) => (
            <Link key={index} className="mr-2" href={item.url ?? ""}>
              {item.label}
              {index < 2 && " •"}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};
