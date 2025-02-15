"use client";
import { useNetworkStore } from "@/hooks/networkStore";
import { useResumeStore } from "@/hooks/store/useResumeStore";
import { useEffect } from "react";

export const NetworkStatus = () => {
  const setOnline = useNetworkStore((state) => state.setOnline);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnline]);

  return null;
};

export const ConnectionStatus = () => {
  const { isOnline, isServerHealthy } = useNetworkStore();
  const error = useResumeStore((state) => state.error);

  if (!isOnline) {
    return (
      <div className="connection-status offline">
        ⚠️ Youre offline - showing cached data
      </div>
    );
  }

  if (!isServerHealthy) {
    return (
      <div className="connection-status warning">
        ⚠️ Connection issues - data might be outdated
      </div>
    );
  }

  if (error) {
    return (
      <div className="connection-status error">
        ⚠️ Error fetching data: {error.message}
      </div>
    );
  }

  return null;
};
