import type React from "react";

interface Props {
  title: string;
  colorHex?: string;
}

export const SectionHeader: React.FC<Props> = ({ title, colorHex }) => (
  <>
    <hr
      className="border-2"
      style={{
        borderColor: colorHex,
      }}
    />
    <h2
      className="text-lg font-semibold"
      style={{
        color: colorHex,
      }}
    >
      {title}
    </h2>
  </>
);
