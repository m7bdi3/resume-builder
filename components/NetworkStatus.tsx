"use client";

import { useNetworkStore } from "@/hooks/networkStore";
import { useResumeStore } from "@/hooks/store/useResumeStore";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const NetworkStatus = () => {
  const setOnline = useNetworkStore((state) => state.setOnline);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      toast({
        title: "You're back online",
        description: "Your connection has been restored.",
        variant: "success",
      });
    };

    const handleOffline = () => {
      setOnline(false);
      toast({
        title: "You're offline",
        description: "Showing cached data. Check your connection.",
        variant: "destructive",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnline, toast]);

  return null;
};

export const ConnectionStatus = () => {
  const { isOnline, isServerHealthy } = useNetworkStore();
  const error = useResumeStore((state) => state.error);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Showing cached data. Check your connection.",
        variant: "destructive",
      });
    } else if (!isServerHealthy) {
      toast({
        title: "Connection issues",
        description: "Data might be outdated. We're working on it.",
        variant: "warning",
      });
    } else if (error) {
      toast({
        title: "Error fetching data",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [isOnline, isServerHealthy, error, toast]);

  return null;
};
