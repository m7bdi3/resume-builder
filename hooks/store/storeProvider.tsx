"use client";

import { useEffect, useRef } from "react";
import { useResumeStore } from "./useResumeStore";
import { CoverLetterServerData, ResumeServerData } from "@/lib/types";
import { SubscriptionLevel } from "@/lib/subscription";
import { useCoverStore } from "./useCoverStore";

interface ResumeProps {
  resumes: ResumeServerData[];
  subLevel: SubscriptionLevel;
  canCreate: boolean;
}
export function InitResumesStore({
  resumes,
  subLevel,
  canCreate,
}: ResumeProps) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useResumeStore.setState({
        resumes,
        subLevel,
        canCreate,
      });
      initState.current = true;
    }
  }, [resumes, subLevel, canCreate]);

  return null;
}

interface CoverProps {
  covers: CoverLetterServerData[];
}
export function InitCoverStore({ covers }: CoverProps) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useCoverStore.setState({
        covers,
      });
      initState.current = true;
    }
  }, [covers]);

  return null;
}
