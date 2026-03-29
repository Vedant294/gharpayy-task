import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '@/lib/subscriptionService';
import type { PlanTier, BillingCycle } from '@/types/subscription';

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => subscriptionService.getPlans(),
  });
};

export const useUserSubscription = () => {
  return useQuery({
    queryKey: ['user-subscription'],
    queryFn: async () => {
      const { data: session } = await import('@/integrations/supabase/client').then(({ supabase }) => supabase.auth.getSession());
      const userId = session?.data?.session?.user?.id;
      if (!userId) return null;
      return subscriptionService.getUserSubscription(userId);
    },
    enabled: false,
  });
};

export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, planId, billingCycle }: { userId: string; planId: string; billingCycle?: BillingCycle }) => {
      return subscriptionService.createUserSubscription(userId, planId, billingCycle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
    },
  });
};

export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ subscriptionId, updates }: { subscriptionId: string; updates: Partial<{ plan_id: string; billing_cycle: BillingCycle; status: 'active' | 'cancelled' | 'past_due' | 'paused'; cancel_at_period_end: boolean }> }) => {
      return subscriptionService.updateSubscription(subscriptionId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
    },
  });
};

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      return subscriptionService.cancelSubscription(subscriptionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-subscription'] });
    },
  });
};

export const useUserPayments = () => {
  return useQuery({
    queryKey: ['user-payments'],
    queryFn: async () => {
      const { data: session } = await import('@/integrations/supabase/client').then(({ supabase }) => supabase.auth.getSession());
      const userId = session?.data?.session?.user?.id;
      if (!userId) return null;
      return subscriptionService.getUserPayments(userId);
    },
    enabled: false,
  });
};

export const useUsageStats = () => {
  return useQuery({
    queryKey: ['usage-stats'],
    queryFn: async () => {
      const { data: session } = await import('@/integrations/supabase/client').then(({ supabase }) => supabase.auth.getSession());
      const userId = session?.data?.session?.user?.id;
      if (!userId) return null;
      return subscriptionService.checkUsageLimits(userId);
    },
    enabled: false,
  });
};
