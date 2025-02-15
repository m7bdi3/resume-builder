"use client";

import { useEffect } from "react";
import { useResumeStore } from "./useResumeStore";
import { SubscriptionLevel } from "@/lib/subscription";
import { useCoverStore } from "./useCoverStore";
import { useResilientQuery } from "../useOfflineQuery";
import { getAllCovers, getAllResumes } from "@/actions/prisma.actions";

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

export function InitCoverStore() {
  const { data, error, isError } = useResilientQuery(["covers"], getAllCovers);

  useEffect(() => {
    useCoverStore.setState({
      covers: data || [],

      error: isError ? error : null,
    });
  }, [data, isError, error]);

  return null;
}
