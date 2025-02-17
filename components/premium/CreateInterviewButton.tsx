"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useResumeStore } from "@/hooks/store/useResumeStore";

export const CreateInterviewButton = () => {
  const { setOpen } = usePremiumModal();
  const { canCreate } = useResumeStore();

  if (canCreate) {
    return (
      <Button asChild>
        <Link href={"/dashboard/interview/create"}>Create</Link>
      </Button>
    );
  }

  return <Button onClick={() => setOpen(true)}>Create</Button>;
};
