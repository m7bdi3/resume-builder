import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

interface BillingDetailsProps {
  planName: string;
  price: number;
  interval?: string;
  status?: "active" | "canceled";
  renewalDate?: Date;
}

export function BillingDetails({
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
            <p className="font-medium">{renewalDate.toLocaleDateString()}</p>
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
