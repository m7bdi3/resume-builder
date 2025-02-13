"use client";

import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { CreditCard, FilePen } from "lucide-react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { SidebarMenu, SidebarMenuItem } from "./ui/sidebar";

export const UserNavButton = () => {
  const { theme } = useTheme();
  const { user } = useUser();
  if (!user) {
    return null;
  }
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex gap-3 items-center h-[35px]">
          <UserButton
            appearance={{
              baseTheme: theme === "dark" ? dark : undefined,
              elements: {
                avatarBox: {
                  width: 35,
                  height: 35,
                },
              },
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Link
                label="Resumes"
                labelIcon={<FilePen className="size-4" />}
                href="/resumes"
              />
              <UserButton.Link
                label="Billing"
                labelIcon={<CreditCard className="size-4" />}
                href="/billing"
              />
            </UserButton.MenuItems>
          </UserButton>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.fullName}</span>
            <span className="truncate text-xs">
              {user.emailAddresses[0].emailAddress}
            </span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
