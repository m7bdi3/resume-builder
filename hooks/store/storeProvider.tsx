"use client";

import { useEffect, useRef } from "react";
import { useResumeStore } from "./useResumeStore";
import { CoverLetterServerData } from "@/lib/types";
import { SubscriptionLevel } from "@/lib/subscription";
import { useCoverStore } from "./useCoverStore";
import { useResilientQuery } from "../useOfflineQuery";
import { getAllResumes } from "@/actions/prisma.actions";

interface ResumeProps {
  subLevel: SubscriptionLevel;
  canCreate: boolean;
}
export function InitResumesStore({ subLevel, canCreate }: ResumeProps) {
  const { data, error, isError } = useResilientQuery(
    ["resumes"],
    getAllResumes
  );

  useEffect(() => {
    useResumeStore.setState({
      resumes: data || [],
      subLevel,
      canCreate,
      error: isError ? error : null,
    });
  }, [data, subLevel, canCreate, isError, error]);

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
