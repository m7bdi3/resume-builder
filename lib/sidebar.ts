import {
  Bot,
  CreditCard,
  FileText,
  Podcast,
  SquareTerminal,
} from "lucide-react";

export const data = {
  navMain: [
    {
      title: "Resumes",
      url: "#",
      icon: SquareTerminal,
      items: [
        { title: "All Resumes", url: "/dashboard/resumes" },
        { title: "Starred", url: "/dashboard/resumes/star" },
        { title: "Generate New", url: "/dashboard/resumes/editor" },
      ],
    },
    {
      title: "Cover Letters",
      url: "#",
      icon: FileText,
      items: [
        { title: "All Cover Letters", url: "/dashboard/coverletters" },
        { title: "Generate New", url: "/dashboard/coverletters/editor" },
      ],
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
  ],
  Latest: [
    {
      title: "Billing",
      url: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      title: "Blog",
      url: "/dashboard/blog",
      icon: Podcast,
    },
  ],
};
