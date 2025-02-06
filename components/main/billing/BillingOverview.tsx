import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { GetSubButton, ManageSubButton } from "@/components/main/GetSubButton";
import stripe from "@/lib/stripe";
import { BillingDetails } from "./BillingDetails";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

interface BillingOverviewProps {
  userId: string;
}

export async function BillingOverview({ userId }: BillingOverviewProps) {
  const subscription = await getUserSubscription(userId);
  const priceInfo = subscription
    ? await getStripePrice(subscription.stripePriceId)
    : null;

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl">Subscription Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <BillingDetails
          planName={(priceInfo?.product as Stripe.Product)?.name ?? "Free"}
          price={priceInfo?.unit_amount ?? 0}
          interval={priceInfo?.recurring?.interval}
          status={subscription?.stripeCancelAtPeriodEnd ? "canceled" : "active"}
          renewalDate={subscription?.stripeCurrentPeriodEnd}
        />

        {subscription?.stripeCancelAtPeriodEnd && (
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Subscription Ending</AlertTitle>
            <AlertDescription className="text-destructive-foreground">
              Access will continue until{" "}
              {subscription.stripeCurrentPeriodEnd.toLocaleDateString()}.
              Reactivate anytime before this date to maintain service.
            </AlertDescription>
          </Alert>
        )}

        <div className="pt-4">
          {subscription ? <ManageSubButton /> : <GetSubButton />}
        </div>
      </CardContent>
    </Card>
  );
}

async function getStripePrice(priceId: string) {
  return stripe.prices.retrieve(priceId, {
    expand: ["product"],
  });
}

async function getUserSubscription(userId: string) {
  return prisma.userSub.findUnique({
    where: { userId: userId },
  });
}
