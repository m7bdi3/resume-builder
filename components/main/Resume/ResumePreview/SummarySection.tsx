import { ResumeSectionProps } from "@/lib/types";

export const SummarySection = ({ resumeData }: ResumeSectionProps) => {
  const { summary } = resumeData;

  if (!summary) return null;

  return (
    <section className="mb-4">
      <p className="text-sm leading-relaxed">{summary}</p>
    </section>
  );
};
