// Usage Tracker for Gharpayy Commercialization
// Tracks usage of various metrics and enforces limits

import { subscriptionService } from './subscriptionService';

export const trackLeadCreation = async (userId: string) => {
  return subscriptionService.trackUsage(userId, 'leads', 1);
};

export const trackAgentAddition = async (userId: string) => {
  return subscriptionService.trackUsage(userId, 'agents', 1);
};

export const trackZoneCreation = async (userId: string) => {
  return subscriptionService.trackUsage(userId, 'zones', 1);
};

export const trackPropertyCreation = async (userId: string) => {
  return subscriptionService.trackUsage(userId, 'properties', 1);
};

export const trackBookingCreation = async (userId: string) => {
  return subscriptionService.trackUsage(userId, 'bookings', 1);
};

export const trackAPICall = async (userId: string) => {
  return subscriptionService.trackUsage(userId, 'api_calls', 1);
};

export const checkUsageLimits = async (userId: string) => {
  return subscriptionService.checkUsageLimits(userId);
};

export const getUsageStats = async (userId: string) => {
  const subscription = await subscriptionService.getUserSubscription(userId);
  const plan = subscription ? subscriptionService.getPlanById(subscription.plan_id) : null;
  
  const limits = plan?.limits || {
    maxLeads: 50,
    maxAgents: 3,
    maxZones: 1,
    maxProperties: 10,
    maxBookings: 20,
  };

  const usage: Record<string, number> = {};

  // Get current usage for each metric
  const metrics = ['leads', 'agents', 'zones', 'properties', 'bookings'] as const;
  for (const metric of metrics) {
    const { data } = await subscriptionService.getUsage(userId, metric, 'monthly');
    usage[metric] = data?.reduce((sum, record) => sum + record.quantity, 0) || 0;
  }

  return {
    usage,
    limits,
    remaining: {
      leads: limits.maxLeads === -1 ? Infinity : limits.maxLeads - (usage.leads || 0),
      agents: limits.maxAgents === -1 ? Infinity : limits.maxAgents - (usage.agents || 0),
      zones: limits.maxZones === -1 ? Infinity : limits.maxZones - (usage.zones || 0),
      properties: limits.maxProperties === -1 ? Infinity : limits.maxProperties - (usage.properties || 0),
      bookings: limits.maxBookings === -1 ? Infinity : limits.maxBookings - (usage.bookings || 0),
    },
    isOverLimit: Object.entries(usage).some(([metric, count]) => {
      const limitKey = `max${metric.charAt(0).toUpperCase() + metric.slice(1)}` as keyof typeof limits;
      return limits[limitKey] !== -1 && count > limits[limitKey];
    }),
  };
};

export const getUsagePercentage = (used: number, limit: number) => {
  if (limit === -1) return 100; // unlimited
  return Math.min(100, Math.round((used / limit) * 100));
};
