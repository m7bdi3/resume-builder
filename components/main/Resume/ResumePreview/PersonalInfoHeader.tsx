import type React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { ResumeValues } from "@/lib/validation";
import { BorderStyles } from "../BorderStyleButton";

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

  return (
    <div className="flex items-center gap-6">
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
          <p className="font-medium" style={{ color: colorHex }}>
            {jobTitle}
          </p>
        </div>
        <p className="text-sm text-gray-500">
          {[city, country, phone, email].filter(Boolean).join(" • ")}
        </p>
      </div>
    </div>
  );
};
