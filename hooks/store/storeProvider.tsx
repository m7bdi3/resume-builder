"use client";

import { useEffect, useRef } from "react";
import { useResumeStore } from "./useResumeStore";
import { ResumeServerData } from "@/lib/types";
import { SubscriptionLevel } from "@/lib/subscription";

interface Props {
  resumes: ResumeServerData[];
  subLevel: SubscriptionLevel;
  canCreate: boolean;
}
export default function InitResumesStore({
  resumes,
  subLevel,
  canCreate,
}: Props) {
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
