"use client";

import { useEffect } from "react";
import { useResilientQuery } from "../useOfflineQuery";
import { useResumeStore } from "./useResumeStore";
import { useCoverStore } from "./useCoverStore";
import { useAtsStore } from "./useAtsStore";
import { useGapStore } from "./useGapStore";
import { useInterviewStore } from "./useInterviewStore";
import { getAllData } from "@/actions/prisma.actions";

export function InitStores() {
  const { data, error, isError, isLoading } = useResilientQuery(
    ["allData"],
    getAllData
  );

  useEffect(() => {
    if (data) {
      useResumeStore.setState({
        resumes: data.resumes || [],
        isLoading,
        error: isError ? error : null,
      });
      useCoverStore.setState({
        covers: data.covers || [],
        isLoading,
        error: isError ? error : null,
      });
      useAtsStore.setState({
        ats: data.ats || [],
        isLoading,
        error: isError ? error : null,
      });
      useGapStore.setState({
        gaps: data.gaps || [],
        isLoading,
        error: isError ? error : null,
      });
      useInterviewStore.setState({
        interviews: data.interviews || [],
        isLoading,
        error: isError ? error : null,
      });
    }
  }, [data, error, isError, isLoading]);

  return null;
}
