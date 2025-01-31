import { Metadata } from "next";
import { ResumeEditor } from "@/components/main/ResumeEditor";

export const metdata: Metadata = {
  title: "Design your resume",
};

export default function EditorPage() {
  return <ResumeEditor />;
}
