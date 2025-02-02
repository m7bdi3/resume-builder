import type React from "react";

interface Props {
  title: string;
  colorHex?: string;
}

export const SectionHeader: React.FC<Props> = ({ title, colorHex }) => (
  <>
    <hr
      style={{
        borderColor: colorHex,
      }}
    />
    <h2
      className="text-lg font-semibold mt-2"
      style={{
        color: colorHex,
      }}
    >
      {title}
    </h2>
  </>
);
