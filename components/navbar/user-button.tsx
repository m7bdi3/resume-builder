"use client";

import React from "react";
import { UserButton } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";

export const UserNavButton = () => {
  const { theme } = useTheme();
  return (
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
          label="Billing"
          labelIcon={<CreditCard className="size-4" />}
          href="/billing"
        />
      </UserButton.MenuItems>
    </UserButton>
  );
};
