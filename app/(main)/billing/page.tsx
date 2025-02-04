import { GetSubButton, ManageSubButton } from "@/components/GetSubButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import stripe from "@/lib/stripe";
import { formatCurrency } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { formatDate } from "date-fns";
import { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import Stripe from "stripe";

export const metadata: Metadata = {
  title: "Billing",
};

export default async function BillingPage() {
  const { userId } = await auth();

  if (!userId) return null;

  const subscription = await prisma.userSub.findUnique({
    where: { userId: userId },
  });

  const priceInfo = subscription
    ? await stripe.prices.retrieve(subscription.stripePriceId, {
        expand: ["product"],
      })
    : null;

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-4xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Billing Settings</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment details
        </p>
      </div>

      <Card className="bg-card/50">
        <CardHeader>
          <CardTitle className="text-xl">Subscription Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <BillingDetails
            planName={(priceInfo?.product as Stripe.Product)?.name ?? "Free"}
            price={priceInfo?.unit_amount ?? 0}
            interval={priceInfo?.recurring?.interval}
            status={
              subscription?.stripeCancelAtPeriodEnd ? "canceled" : "active"
            }
            renewalDate={subscription?.stripeCurrentPeriodEnd}
          />

          {subscription?.stripeCancelAtPeriodEnd && (
            <Alert variant="destructive" className="border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Subscription Ending</AlertTitle>
              <AlertDescription className="text-destructive-foreground">
                Access will continue until{" "}
                {formatDate(
                  subscription.stripeCurrentPeriodEnd,
                  "MMMM dd, yyyy"
                )}
                . Reactivate anytime before this date to maintain service.
              </AlertDescription>
            </Alert>
          )}

          <div className="pt-4">
            {subscription ? <ManageSubButton /> : <GetSubButton />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface BillingDetailsProps {
  planName: string;
  price: number;
  interval?: string;
  status?: "active" | "canceled";
  renewalDate?: Date;
}

function BillingDetails({
  planName,
  price,
  interval,
  status,
  renewalDate,
}: BillingDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Badge
          variant={status === "active" ? "default" : "destructive"}
          className="w-fit"
        >
          {status?.toUpperCase()}
        </Badge>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{planName}</h3>
          <p className="text-muted-foreground">
            {price > 0 ? (
              <>
                {formatCurrency(price / 100)}
                {interval && `/${interval}`}
              </>
            ) : (
              "Free Tier"
            )}
          </p>
        </div>
      </div>

      <Separator className="bg-border/50" />

      {renewalDate && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-muted-foreground">Next Billing Date</p>
            <p className="font-medium">
              {formatDate(renewalDate, "MMMM dd, yyyy")}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Billing Cycle</p>
            <p className="font-medium capitalize">
              {interval ? `${interval}ly` : "N/A"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
