"use client";

import { useNetworkStore } from "@/hooks/networkStore";

export const ConnectionNotification = () => {
  const isOnline = useNetworkStore((state) => state.isOnline);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg shadow-lg">
      Connection lost - showing cached data. Updates will resume when back
      online.
    </div>
  );
};
