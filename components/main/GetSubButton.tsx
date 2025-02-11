"use client";

import { useState } from "react";
import usePremiumModal from "@/hooks/usePremiumModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LoadingButton } from "@/components/main/LoadingButton";
import { createCustomerPortal } from "@/actions/premium.actions";

export const GetSubButton = () => {
  const { open, setOpen } = usePremiumModal();
  return (
    <Button onClick={() => setOpen(!open)}>Get Premium Subscription</Button>
  );
};

export const ManageSubButton = () => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  async function handleClick() {
    try {
      setLoading(true);
      const res = await createCustomerPortal();
      window.location.href = res;
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoadingButton onClick={handleClick} loading={loading}>
      Manage Subscription
    </LoadingButton>
  );
};
