"use client";

import { useEffect, useRef } from "react";
import { useResumeStore } from "./useResumeStore";
import { ResumeServerData } from "@/lib/types";

interface Props {
  resumes: ResumeServerData[];
}
export default function InitResumesStore({ resumes }: Props) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useResumeStore.setState({
        resumes,
      });
      initState.current = true;
    }
  }, [resumes]);

  return null;
}
