// Subscription Types for Gharpayy Commercialization

export type PlanTier = 'free' | 'starter' | 'professional' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: PlanTier;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  limits: PlanLimits;
  sortOrder: number;
  isPopular?: boolean;
  createdAt: string;
}

export interface PlanLimits {
  maxLeads: number;
  maxAgents: number;
  maxZones: number;
  maxProperties: number;
  maxBookings: number;
  includesWhatsApp: boolean;
  includesSMS: boolean;
  includesAPI: boolean;
  includesWhiteLabel: boolean;
  includesAnalytics: boolean;
  includesPrioritySupport: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  tier: PlanTier;
  billingCycle: BillingCycle;
  status: 'active' | 'cancelled' | 'past_due' | 'paused';
  startDate: string;
  endDate?: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentGateway: 'razorpay' | 'stripe' | 'payu';
  status: PaymentStatus;
  transactionId?: string;
  receiptUrl?: string;
  createdAt: string;
}

export interface UsageRecord {
  id: string;
  user_id: string;
  metric: 'leads' | 'agents' | 'zones' | 'properties' | 'bookings' | 'api_calls';
  quantity: number;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

export interface WhiteLabelConfig {
  id: string;
  user_id: string;
  brandName: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  faviconUrl?: string;
  customDomain?: string;
  footerText?: string;
  isCustomDomainVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'plan_free',
    name: 'Free Trial',
    tier: 'free' as const,
    priceMonthly: 0,
    priceYearly: 0,
    description: 'Perfect for testing and small projects',
    features: [
      '50 leads per month',
      '3 agents',
      'Basic analytics',
      '1 zone',
      'Standard support',
    ],
    limits: {
      maxLeads: 50,
      maxAgents: 3,
      maxZones: 1,
      maxProperties: 10,
      maxBookings: 20,
      includesWhatsApp: false,
      includesSMS: false,
      includesAPI: false,
      includesWhiteLabel: false,
      includesAnalytics: false,
      includesPrioritySupport: false,
    },
    sortOrder: 1,
    createdAt: new Date().toISOString(),
  },
  starter: {
    id: 'plan_starter',
    name: 'Starter',
    tier: 'starter' as const,
    priceMonthly: 299,
    priceYearly: 2990,
    description: 'For growing PG businesses',
    features: [
      '500 leads per month',
      '10 agents',
      'Advanced analytics',
      '5 zones',
      'WhatsApp integration',
      'Priority support',
    ],
    limits: {
      maxLeads: 500,
      maxAgents: 10,
      maxZones: 5,
      maxProperties: 50,
      maxBookings: 100,
      includesWhatsApp: true,
      includesSMS: false,
      includesAPI: false,
      includesWhiteLabel: false,
      includesAnalytics: true,
      includesPrioritySupport: true,
    },
    sortOrder: 2,
    isPopular: true,
    createdAt: new Date().toISOString(),
  },
  professional: {
    id: 'plan_professional',
    name: 'Professional',
    tier: 'professional' as const,
    priceMonthly: 899,
    priceYearly: 8990,
    description: 'For established property management',
    features: [
      'Unlimited leads',
      '50 agents',
      'Full analytics suite',
      'Unlimited zones',
      'WhatsApp + SMS integration',
      'REST API access',
      'Custom reporting',
      'Dedicated support',
    ],
    limits: {
      maxLeads: -1,
      maxAgents: 50,
      maxZones: -1,
      maxProperties: -1,
      maxBookings: -1,
      includesWhatsApp: true,
      includesSMS: true,
      includesAPI: true,
      includesWhiteLabel: false,
      includesAnalytics: true,
      includesPrioritySupport: true,
    },
    sortOrder: 3,
    createdAt: new Date().toISOString(),
  },
  enterprise: {
    id: 'plan_enterprise',
    name: 'Enterprise',
    tier: 'enterprise' as const,
    priceMonthly: 2999,
    priceYearly: 29990,
    description: 'For large-scale operations',
    features: [
      'Everything in Professional',
      'Unlimited everything',
      'White-label solution',
      'Custom development',
      'SLA guarantees',
      'On-premise deployment',
      'Training & onboarding',
    ],
    limits: {
      maxLeads: -1,
      maxAgents: -1,
      maxZones: -1,
      maxProperties: -1,
      maxBookings: -1,
      includesWhatsApp: true,
      includesSMS: true,
      includesAPI: true,
      includesWhiteLabel: true,
      includesAnalytics: true,
      includesPrioritySupport: true,
    },
    sortOrder: 4,
    createdAt: new Date().toISOString(),
  },
};
