"use client";

import { useEffect } from "react";
import { useResumeStore } from "./useResumeStore";
import { useCoverStore } from "./useCoverStore";
import { useResilientQuery } from "../useOfflineQuery";
import {
  getAllAts,
  getAllCovers,
  getAllGaps,
  getAllInterview,
  getAllResumes,
} from "@/actions/prisma.actions";
import { useAtsStore } from "./useAtsStore";
import { useGapStore } from "./useGapStore";
import { useInterviewStore } from "./useInterviewStore";

export function InitResumesStore() {
  const { data, error, isError } = useResilientQuery(
    ["resumes"],
    getAllResumes
  );

  useEffect(() => {
    useResumeStore.setState({
      resumes: data || [],
      error: isError ? error : null,
    });
  }, [data, isError, error]);

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

export function InitAtsStore() {
  const { data, error, isError } = useResilientQuery(["ats"], getAllAts);

  useEffect(() => {
    useAtsStore.setState({
      ats: data || [],

      error: isError ? error : null,
    });
  }, [data, isError, error]);

  return null;
}

export function InitGapStore() {
  const { data, error, isError } = useResilientQuery(["gap"], getAllGaps);

  useEffect(() => {
    useGapStore.setState({
      gaps: data || [],

      error: isError ? error : null,
    });
  }, [data, isError, error]);

  return null;
}

export function InitInterviewStore() {
  const { data, error, isError } = useResilientQuery(
    ["interview"],
    getAllInterview
  );

  useEffect(() => {
    useInterviewStore.setState({
      interviews: data || [],

      error: isError ? error : null,
    });
  }, [data, isError, error]);

  return null;
}
