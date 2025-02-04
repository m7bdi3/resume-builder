import { cache } from "react";
import prisma from "./prisma";
import { env } from "@/env";

export type SubscriptionLevel = "free" | "pro" | "pro_plus";

export const getUserSubscriptionLevel = cache(
  async (userId: string): Promise<SubscriptionLevel> => {
    const subs = await prisma.userSub.findUnique({
      where: {
        userId,
      },
    });
    if (!subs || subs.stripeCurrentPeriodEnd < new Date()) {
      return "free";
    }

    if (subs.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY) {
      return "pro";
    }
    if (subs.stripePriceId === env.NEXT_PUBLIC_STRIPE_PRO_PLUS_MONTHLY) {
      return "pro_plus";
    }

    throw new Error("Invalid subscription");
  }
);
