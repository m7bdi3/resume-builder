import { redis } from "@/lib/redis";
import stripe from "@/lib/stripe";

import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");
  const token = searchParams.get("token");

  if (!sessionId || !token) {
    return NextResponse.redirect(new URL("/dashboard/billing", request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.status !== "complete") {
      throw new Error("Payment not completed");
    }

    if (session.metadata?.successToken !== token) {
      throw new Error("Invalid token");
    }
    await redis.set(`payment_success:${token}`, "true", { ex: 3600 });

    return NextResponse.redirect(
      new URL(`/dashboard/billing/success?token=${token}`, request.url)
    );
  } catch (error) {
    console.error("Error verifying payment success:", error);
    return NextResponse.redirect(new URL("/dashboard/billing", request.url));
  }
}
