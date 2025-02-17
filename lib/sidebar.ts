import {
  Bot,
  FileText,
  Podcast,
  SquareTerminal,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Resumes",
      url: "/dashboard/resumes",
      icon: SquareTerminal,
    },
    {
      title: "Cover Letters",
      url: "/dashboard/coverletters",
      icon: FileText,
    },
    {
      title: "AI Tools",
      url: "#",
      icon: Bot,
      items: [
        { title: "ATS Checker", url: "/dashboard/ats" },
        { title: "Gap Analysis", url: "/dashboard/gap" },
        { title: "Interview Q&A", url: "/dashboard/interview" },
      ],
    },
    
    {
      title: "Blog",
      url: "/dashboard/blog",
      icon: Podcast,
    },
  ],
};
