// Subscription Service for Gharpayy Commercialization
// Manages plans, subscriptions, and usage tracking

import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { SUBSCRIPTION_PLANS, type PlanTier, type BillingCycle, type PaymentStatus } from '@/types/subscription';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type Payment = Database['public']['Tables']['payments']['Row'];
type UsageRecord = Database['public']['Tables']['usage_records']['Row'];

class SubscriptionService {
  private isTestMode: boolean = true;

  constructor() {
    this.isTestMode = import.meta.env.VITE_IS_TEST_MODE !== 'false';
  }

  // ==================== Plan Management ====================

  public getPlans() {
    return SUBSCRIPTION_PLANS;
  }

  public getPlanById(planId: string) {
    return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.id === planId);
  }

  public getPlanByTier(tier: PlanTier) {
    return SUBSCRIPTION_PLANS[tier];
  }

  // ==================== Subscription Management ====================

  public async getUserSubscription(userId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plans (*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('Error getting subscription:', error);
      return null;
    }

    return data;
  }

  public async createUserSubscription(
    userId: string,
    planId: string,
    billingCycle: BillingCycle = 'monthly'
  ) {
    const plan = this.getPlanById(planId);
    if (!plan) return { error: 'Plan not found' };

    const now = new Date();
    const periodStart = now.toISOString();
    const periodEnd = billingCycle === 'monthly' 
      ? new Date(now.setMonth(now.getMonth() + 1)).toISOString()
      : new Date(now.setFullYear(now.getFullYear() + 1)).toISOString();

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        tier: plan.tier,
        billing_cycle: billingCycle,
        status: 'active',
        start_date: periodStart,
        current_period_start: periodStart,
        current_period_end: periodEnd,
        cancel_at_period_end: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return { error: error.message };
    }

    return { data, error: null };
  }

  public async updateSubscription(
    subscriptionId: string,
    updates: Partial<{
      plan_id: string;
      billing_cycle: BillingCycle;
      status: 'active' | 'cancelled' | 'past_due' | 'paused';
      cancel_at_period_end: boolean;
    }>
  ) {
    const { data, error } = await supabase
      .from('subscriptions')
      .update(updates)
      .eq('id', subscriptionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating subscription:', error);
      return { error: error.message };
    }

    return { data, error: null };
  }

  public async cancelSubscription(subscriptionId: string) {
    return this.updateSubscription(subscriptionId, {
      status: 'cancelled',
      cancel_at_period_end: true,
    });
  }

  // ==================== Payment Management ====================

  public async createPayment(
    subscriptionId: string,
    amount: number,
    paymentMethod: string,
    paymentGateway: 'razorpay' | 'stripe' | 'payu',
    transactionId?: string,
    receiptUrl?: string
  ) {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        subscription_id: subscriptionId,
        amount,
        currency: 'INR',
        payment_method: paymentMethod,
        payment_gateway: paymentGateway,
        status: 'completed',
        transaction_id: transactionId,
        receipt_url: receiptUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating payment:', error);
      return { error: error.message };
    }

    return { data, error: null };
  }

  public async getUserPayments(userId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        subscriptions (tier, billing_cycle)
      `)
      .eq('subscriptions.user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting payments:', error);
      return { error: error.message };
    }

    return { data, error: null };
  }

  // ==================== Usage Tracking ====================

  public async trackUsage(
    userId: string,
    metric: 'leads' | 'agents' | 'zones' | 'properties' | 'bookings' | 'api_calls',
    quantity: number = 1
  ) {
    const today = new Date().toISOString().split('T')[0];
    const periodStart = `${today}T00:00:00Z`;
    const periodEnd = `${today}T23:59:59Z`;

    // Check if usage record exists for today
    let { data: existingUsage } = await supabase
      .from('usage_records')
      .select('*')
      .eq('user_id', userId)
      .eq('metric', metric)
      .gte('period_start', periodStart)
      .lte('period_end', periodEnd)
      .single();

    if (existingUsage) {
      // Update existing usage
      const { data, error } = await supabase
        .from('usage_records')
        .update({
          quantity: existingUsage.quantity + quantity,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUsage.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating usage:', error);
        return { error: error.message };
      }

      return { data, error: null };
    } else {
      // Create new usage record
      const { data, error } = await supabase
        .from('usage_records')
        .insert({
          user_id: userId,
          metric,
          quantity,
          period_start: periodStart,
          period_end: periodEnd,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating usage record:', error);
        return { error: error.message };
      }

      return { data, error: null };
    }
  }

  public async getUsage(userId: string, metric: string, period: 'daily' | 'weekly' | 'monthly' = 'monthly') {
    const now = new Date();
    let periodStart: Date;

    if (period === 'daily') {
      periodStart = new Date(now.setHours(0, 0, 0, 0));
    } else if (period === 'weekly') {
      periodStart = new Date(now.setDate(now.getDate() - 7));
    } else {
      periodStart = new Date(now.setMonth(now.getMonth() - 1));
    }

    const { data, error } = await supabase
      .from('usage_records')
      .select('metric, quantity, period_start')
      .eq('user_id', userId)
      .gte('period_start', periodStart.toISOString())
      .order('period_start', { ascending: true });

    if (error) {
      console.error('Error getting usage:', error);
      return { error: error.message };
    }

    return { data, error: null };
  }

  public async checkUsageLimits(userId: string) {
    const subscription = await this.getUserSubscription(userId);
    if (!subscription) return { exceeded: false, limits: {} };

    const plan = this.getPlanById(subscription.plan_id);
    if (!plan) return { exceeded: false, limits: {} };

    const limits = plan.limits;
    const usage: Record<string, number> = {};

    // Check each metric
    const metrics: ('leads' | 'agents' | 'zones' | 'properties' | 'bookings')[] = [
      'leads', 'agents', 'zones', 'properties', 'bookings'
    ];

    for (const metric of metrics) {
      if (limits[`max${metric.charAt(0).toUpperCase() + metric.slice(1)}`] === -1) {
        usage[metric] = -1; // unlimited
        continue;
      }

      const { data } = await this.getUsage(userId, metric, 'monthly');
      usage[metric] = data?.reduce((sum, record) => sum + record.quantity, 0) || 0;
    }

    const exceeded = Object.entries(usage).some(([metric, count]) => {
      const limitKey = `max${metric.charAt(0).toUpperCase() + metric.slice(1)}` as keyof typeof limits;
      return limits[limitKey] !== -1 && count > limits[limitKey];
    });

    return { exceeded, limits: usage };
  }

  // ==================== White-label Management ====================

  public async getWhiteLabelConfig(userId: string) {
    const { data, error } = await supabase
      .from('white_label_configs')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error getting white-label config:', error);
      return null;
    }

    return data;
  }

  public async createOrUpdateWhiteLabelConfig(
    userId: string,
    config: Partial<{
      brand_name: string;
      logo_url: string;
      primary_color: string;
      secondary_color: string;
      favicon_url: string;
      custom_domain: string;
      footer_text: string;
      is_custom_domain_verified: boolean;
    }>
  ) {
    const { data: existingConfig } = await supabase
      .from('white_label_configs')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (existingConfig) {
      // Update existing
      const { data, error } = await supabase
        .from('white_label_configs')
        .update(config)
        .eq('id', existingConfig.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating white-label config:', error);
        return { error: error.message };
      }

      return { data, error: null };
    } else {
      // Create new
      const { data, error } = await supabase
        .from('white_label_configs')
        .insert({
          user_id: userId,
          ...config,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating white-label config:', error);
        return { error: error.message };
      }

      return { data, error: null };
    }
  }

  // ==================== Helper Methods ====================

  public isFreeTier(subscription: Subscription | null) {
    return subscription?.tier === 'free' || !subscription;
  }

  public isPaidTier(subscription: Subscription | null) {
    return subscription && subscription.tier !== 'free';
  }

  public canAccessFeature(subscription: Subscription | null, feature: string) {
    if (!subscription) return false;

    const plan = this.getPlanById(subscription.plan_id);
    if (!plan) return false;

    switch (feature) {
      case 'whatsapp':
        return plan.limits.includesWhatsApp;
      case 'sms':
        return plan.limits.includesSMS;
      case 'api':
        return plan.limits.includesAPI;
      case 'whitelabel':
        return plan.limits.includesWhiteLabel;
      case 'analytics':
        return plan.limits.includesAnalytics;
      case 'prioritySupport':
        return plan.limits.includesPrioritySupport;
      default:
        return true;
    }
  }
}

export const subscriptionService = new SubscriptionService();
