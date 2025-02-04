import { env } from "@/env";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.text();

    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return new Response("Signature is missing", { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed":
        await handleSessionCompleted(event.data.object);
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubCreateOrUpdate(event.data.object.id);
        break;

      case "customer.subscription.deleted":
        await handleSubDeleted(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return new Response("Event recieved", { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  if (!userId) {
    throw new Error("User Id is missing in session metadata");
  }

  await (
    await clerkClient()
  ).users.updateUserMetadata(userId, {
    privateMetadata: {
      stripeCustomerId: session.customer as string,
    },
  });
}

async function handleSubCreateOrUpdate(subId: string) {
  const sub = await stripe.subscriptions.retrieve(subId);

  if (sub.status === "active" || sub.status === "trialing") {
    await prisma.userSub.upsert({
      where: { userId: sub.metadata.userId },
      create: {
        userId: sub.metadata.userId,
        stripeSubscriptionId: sub.id,
        stripeCustomeId: sub.customer as string,
        stripePriceId: sub.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
        stripeCancelAtPeriodEnd: sub.cancel_at_period_end,
      },
      update: {
        stripePriceId: sub.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
        stripeCancelAtPeriodEnd: sub.cancel_at_period_end,
      },
    });
  } else {
    await prisma.userSub.deleteMany({
      where: {
        stripeCustomeId: sub.customer as string,
      },
    });
  }
}

async function handleSubDeleted(sub: Stripe.Subscription) {
  await prisma.userSub.deleteMany({
    where: {
      stripeCustomeId: sub.customer as string,
    },
  });
}
