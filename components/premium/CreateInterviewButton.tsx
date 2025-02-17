"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CreateInterviewButton = () => {
  return (
    <Button asChild>
      <Link href={"/dashboard/interview/create"}>Create</Link>
    </Button>
  );
};
