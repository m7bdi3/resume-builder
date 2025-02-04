import { SubscriptionLevel } from "./subscription";

export const canCreateResume = (
  subLevel: SubscriptionLevel,
  currentResumeCount: number
) => {
  const maxResumeMap: Record<SubscriptionLevel, number> = {
    free: 1,
    pro: 3,
    pro_plus: Infinity,
  };

  const maxResumes = maxResumeMap[subLevel];

  return currentResumeCount < maxResumes;
};

export const canUseAiTools = (subLevel: SubscriptionLevel) => {
  return subLevel !== "free";
};

export const canUseCustom = (subLevel: SubscriptionLevel) => {
  return subLevel === "pro_plus";
};
