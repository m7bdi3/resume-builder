"use client";

import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { PlusSquare } from "lucide-react";
import usePremiumModal from "@/hooks/usePremiumModal";

interface Props {
  canCreate: boolean;
  resumeId: string;
}

export const CreateCoverLetterButton = ({ canCreate, resumeId }: Props) => {
  const { setOpen } = usePremiumModal();

  if (canCreate) {
    return (
      <Button asChild className="mx-auto flex w-fit gap-2">
        <Link href={`/resumes/${resumeId}/coverletter/create`}>
          <PlusSquare className="size-5" />
          Create
        </Link>
      </Button>
    );
  }

  return (
    <Button onClick={() => setOpen(true)} className="flex w-fit gap-2">
      <PlusSquare className="size-5" />
      Create
    </Button>
  );
};
