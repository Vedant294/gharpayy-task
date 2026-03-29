-- Subscription Tables for Gharpayy Commercialization

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'starter', 'professional', 'enterprise')),
  price_monthly INTEGER NOT NULL DEFAULT 0,
  price_yearly INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  features JSONB,
  limits JSONB,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_popular BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL REFERENCES subscription_plans(id),
  tier TEXT NOT NULL CHECK (tier IN ('free', 'starter', 'professional', 'enterprise')),
  billing_cycle TEXT NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'paused')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_method TEXT NOT NULL,
  payment_gateway TEXT NOT NULL CHECK (payment_gateway IN ('razorpay', 'stripe', 'payu')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create usage records table
CREATE TABLE IF NOT EXISTS usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  metric TEXT NOT NULL CHECK (metric IN ('leads', 'agents', 'zones', 'properties', 'bookings', 'api_calls')),
  quantity INTEGER NOT NULL DEFAULT 1,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create white-label configs table
CREATE TABLE IF NOT EXISTS white_label_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#6366f1',
  secondary_color TEXT DEFAULT '#8b5cf6',
  favicon_url TEXT,
  custom_domain TEXT,
  footer_text TEXT,
  is_custom_domain_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE white_label_configs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read subscription plans"
  ON subscription_plans FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = (SELECT user_id FROM subscriptions WHERE id = payments.subscription_id));

CREATE POLICY "Users can read own usage records"
  ON usage_records FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own white-label configs"
  ON white_label_configs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own white-label configs"
  ON white_label_configs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own white-label configs"
  ON white_label_configs FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_id ON subscriptions(plan_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_subscription_id ON payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_user_id ON usage_records(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_records_metric ON usage_records(metric);
CREATE INDEX IF NOT EXISTS idx_white_label_user_id ON white_label_configs(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_white_label_configs_updated_at
  BEFORE UPDATE ON white_label_configs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default subscription plans
INSERT INTO subscription_plans (id, name, tier, price_monthly, price_yearly, description, features, limits, sort_order, is_popular)
VALUES 
  ('plan_free', 'Free Trial', 'free', 0, 0, 'Perfect for testing and small projects', 
   '["50 leads per month", "3 agents", "Basic analytics", "1 zone", "Standard support"]',
   '{"maxLeads": 50, "maxAgents": 3, "maxZones": 1, "maxProperties": 10, "maxBookings": 20, "includesWhatsApp": false, "includesSMS": false, "includesAPI": false, "includesWhiteLabel": false, "includesAnalytics": false, "includesPrioritySupport": false}',
   1, false),

  ('plan_starter', 'Starter', 'starter', 299, 2990, 'For growing PG businesses',
   '["500 leads per month", "10 agents", "Advanced analytics", "5 zones", "WhatsApp integration", "Priority support"]',
   '{"maxLeads": 500, "maxAgents": 10, "maxZones": 5, "maxProperties": 50, "maxBookings": 100, "includesWhatsApp": true, "includesSMS": false, "includesAPI": false, "includesWhiteLabel": false, "includesAnalytics": true, "includesPrioritySupport": true}',
   2, true),

  ('plan_professional', 'Professional', 'professional', 899, 8990, 'For established property management',
   '["Unlimited leads", "50 agents", "Full analytics suite", "Unlimited zones", "WhatsApp + SMS integration", "REST API access", "Custom reporting", "Dedicated support"]',
   '{"maxLeads": -1, "maxAgents": 50, "maxZones": -1, "maxProperties": -1, "maxBookings": -1, "includesWhatsApp": true, "includesSMS": true, "includesAPI": true, "includesWhiteLabel": false, "includesAnalytics": true, "includesPrioritySupport": true}',
   3, false),

  ('plan_enterprise', 'Enterprise', 'enterprise', 2999, 29990, 'For large-scale operations',
   '["Everything in Professional", "Unlimited everything", "White-label solution", "Custom development", "SLA guarantees", "On-premise deployment", "Training & onboarding"]',
   '{"maxLeads": -1, "maxAgents": -1, "maxZones": -1, "maxProperties": -1, "maxBookings": -1, "includesWhatsApp": true, "includesSMS": true, "includesAPI": true, "includesWhiteLabel": true, "includesAnalytics": true, "includesPrioritySupport": true}',
   4, false)
ON CONFLICT (id) DO NOTHING;
