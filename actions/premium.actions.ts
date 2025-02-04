"use server";

import { env } from "@/env";
import stripe from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs/server";

export async function createCheckoutSession(priceId: string) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const stripeCustomerId = user.privateMetadata.stripeCustomerId as
    | string
    | undefined;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${env.NEXT_PUBLIC_BASE_URL}/billing/success`,
    cancel_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
    customer: stripeCustomerId,
    customer_email: stripeCustomerId
      ? undefined
      : user.emailAddresses[0].emailAddress,
    metadata: {
      userId: user.id,
    },
    subscription_data: {
      metadata: {
        userId: user.id,
      },
    },
    custom_text: {
      terms_of_service_acceptance: {
        message: `I have read D3 resume builder's [terms of service](${env.NEXT_PUBLIC_BASE_URL}/tos) and agree to them.`,
      },
    },
    consent_collection: {
      terms_of_service: "required",
    },
  });

  if (!session.url) {
    throw new Error("failed to create a checkout session");
  }
  return session.url;
}

export async function createCustomerPortal() {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const stripeCustomerId = user.privateMetadata.stripeCustomerId as
    | string
    | undefined;

  if (!stripeCustomerId) {
    throw new Error("stripe customer id not found");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${env.NEXT_PUBLIC_BASE_URL}/billing`,
  });

  if (!session) {
    throw new Error("failed to create customer portal session");
  }

  return session.url;
}
