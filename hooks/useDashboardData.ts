import { useResumeStore } from "@/hooks/store/useResumeStore";
import { useCoverStore } from "@/hooks/store/useCoverStore";
import { useAtsStore } from "@/hooks/store/useAtsStore";
import { useGapStore } from "@/hooks/store/useGapStore";
import { useInterviewStore } from "@/hooks/store/useInterviewStore";
import type { atsResult, GapResult, InterviewResult } from "@prisma/client";
import type { ResumeServerData, CoverLetterServerData } from "@/lib/types";

export function useDashboardData() {
  const { resumes, isLoading: resumeLoading } = useResumeStore();
  const { covers, isLoading: coverLoading } = useCoverStore();
  const { ats: atsResults, isLoading: atsLoading } = useAtsStore();
  const { gaps, isLoading: gapLoading } = useGapStore();
  const { interviews, isLoading: interviewLoading } = useInterviewStore();

  const isLoading =
    resumeLoading ||
    coverLoading ||
    atsLoading ||
    gapLoading ||
    interviewLoading;

  return {
    isLoading,
    data: {
      resumes: resumes as ResumeServerData[],
      covers: covers as CoverLetterServerData[],
      atsResults: atsResults as atsResult[],
      gaps: gaps as GapResult[],
      interviews: interviews as InterviewResult[],
    },
  };
}
