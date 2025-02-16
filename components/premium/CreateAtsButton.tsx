"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import usePremiumModal from "@/hooks/usePremiumModal";
import { useResumeStore } from "@/hooks/store/useResumeStore";

export const CreateAtsButton = () => {
  const { setOpen } = usePremiumModal();
  const { canCreate } = useResumeStore();

  if (canCreate) {
    return (
      <Button asChild>
        <Link href={"/dashboard/ats/create"}>Create</Link>
      </Button>
    );
  }

  return <Button onClick={() => setOpen(true)}>Create</Button>;
};
