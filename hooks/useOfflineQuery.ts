import { useQuery } from "@tanstack/react-query";
import { useNetworkStore } from "./networkStore";
import { checkServerHealth } from "@/lib/serverHealth";

export const useResilientQuery = <T>(
  queryKey: string[],
  queryFn: () => Promise<T>
) => {
  const { isOnline, setServerHealthy } = useNetworkStore();

  return useQuery({
    queryKey,
    queryFn: async () => {
      const isServerHealthy = await checkServerHealth();
      setServerHealthy(isServerHealthy);

      if (!isServerHealthy) {
        throw new Error("server_unavailable");
      }

      return queryFn();
    },
    retry: (failureCount, error) => {
      if (error.message === "server_unavailable") return false;
      return failureCount < 3;
    },
    staleTime: 5 * 60 * 1000,
    networkMode: "offlineFirst",
    enabled: isOnline,
  });
};
