import { GetSubButton, ManageSubButton } from "@/components/GetSubButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { formatCurrency } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import Stripe from "stripe";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function BillingPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const subscription = await prisma.userSub.findUnique({
    where: { userId: userId },
  });

  const priceInfo = subscription
    ? await stripe.prices.retrieve(subscription.stripePriceId, {
        expand: ["product"],
      })
    : null;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Billing</h1>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BillingDetails
            planName={(priceInfo?.product as Stripe.Product)?.name ?? "Free"}
            price={priceInfo?.unit_amount ?? 0}
            interval={priceInfo?.recurring?.interval}
          />

          {subscription?.stripeCancelAtPeriodEnd && (
            <Alert variant="destructive">
              <AlertTitle>Subscription Canceling</AlertTitle>
              <AlertDescription>
                Your subscription will be canceled on{" "}
                {formatDate(
                  subscription.stripeCurrentPeriodEnd,
                  "MMMM dd, yyyy"
                )}
              </AlertDescription>
            </Alert>
          )}

          {subscription ? <ManageSubButton /> : <GetSubButton />}
        </CardContent>
      </Card>
    </div>
  );
}

interface BillingDetailsProps {
  planName: string;
  price: number;
  interval?: string;
}

function BillingDetails({ planName, price, interval }: BillingDetailsProps) {
  return (
    <div className="space-y-2">
      <p className="text-lg font-medium">
        Current Plan: <span className="font-semibold">{planName}</span>
      </p>
      <p>
        Price: {formatCurrency(price / 100)} {interval && `/ ${interval}`}
      </p>
    </div>
  );
}
