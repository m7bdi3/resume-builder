"use client";

import { createContext, ReactNode, useContext } from "react";
import { SubscriptionLevel } from "@/lib/subscription";

const SubsContext = createContext<SubscriptionLevel | undefined>(undefined);

interface Props {
  children: ReactNode;
  userSubsLevel: SubscriptionLevel;
}

export const SubsProvider = ({ children, userSubsLevel }: Props) => {
  return (
    <SubsContext.Provider value={userSubsLevel}>
      {children}
    </SubsContext.Provider>
  );
};

export const useSubsLevel = () => {
  const context = useContext(SubsContext);
  if (context === undefined) {
    throw new Error("useSubsLevel must be used within a SubsProvider");
  }
  return context;
};
