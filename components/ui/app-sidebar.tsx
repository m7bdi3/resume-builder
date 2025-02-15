"use client";
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
import { UserNavButton } from "../user-button";
import { LogoHeader } from "./logo-header";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { data } from "@/lib/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="top-12 h-[calc(100vh-3rem)]"
    >
      <SidebarHeader>
        <LogoHeader />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={"Dashboard"}
                isActive={pathname === "/dashboard"}
              >
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
        <NavMain pathname={pathname} items={data.navMain} />
        <NavMain pathname={pathname} items={data.Latest} />
      </SidebarContent>
      <SidebarFooter>
        <UserNavButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
