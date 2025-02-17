"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export const CreateResumeButton = () => {

    return (
      <Button asChild>
        <Link href={"/dashboard/resumes/editor"}>Create</Link>
      </Button>
    );

};
