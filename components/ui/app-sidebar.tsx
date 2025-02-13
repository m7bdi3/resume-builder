"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Box,
  FileText,
  Frame,
  LayoutDashboard,
  PieChart,
  SquareTerminal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { ThemeToggle } from "../theme-toggle";
import { UserNavButton } from "../user-button";
import { LogoHeader } from "./logo-header";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Resumes",
      url: "",
      icon: SquareTerminal,
      isActive: true,
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
        { title: "Generate New", url: "/dashboard/coverletters/ceate" },
      ],
    },
    {
      title: "AI Tools",
      url: "#",
      icon: Bot,
      items: [
        { title: "ATS Checker", url: "/dashboard/ats" },
        { title: "Optimizer", url: "/dashboard/optimizer" },
        { title: "Gap Analysis", url: "/dashboard/gap" },
        { title: "Interview Q&A", url: "/dashboard/interview" },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        { title: "Introduction", url: "#" },
        { title: "Get Started", url: "#" },
        { title: "Tutorials", url: "#" },
        { title: "Changelog", url: "#" },
      ],
    },
  ],
  Latest: [
    {
      name: "Design & Creative",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Engineering",
      url: "#",
      icon: Box,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <LogoHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={"Dashboard"}>
                <Link
                  href={"/dashboard"}
                  className="flex items-center group/collapsible gap-2"
                >
                  <LayoutDashboard className="size-4" />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.Latest} />
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
        <UserNavButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
