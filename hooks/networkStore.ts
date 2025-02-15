// store/networkStore.ts
import { create } from "zustand";
type NetworkState = {
  isOnline: boolean;
  isServerHealthy: boolean;
  setOnline: (status: boolean) => void;
  setServerHealthy: (status: boolean) => void;
};

export const useNetworkStore = create<NetworkState>((set) => ({
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  isServerHealthy: true,
  setOnline: (status) => set({ isOnline: status }),
  setServerHealthy: (status) => set({ isServerHealthy: status }),
}));
