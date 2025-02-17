"use client";

import Link from "next/link";
import { PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CreateCoverLetterButton = () => {
  return (
    <Button asChild className="mx-auto flex w-fit gap-2">
      <Link href={`/dashboard/coverletters/editor`}>
        <PlusSquare className="size-5" />
        Create
      </Link>
    </Button>
  );
};
