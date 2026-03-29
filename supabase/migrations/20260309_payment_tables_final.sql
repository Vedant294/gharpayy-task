-- Payment Tables for Gharpayy (Final)
-- This migration creates payment-related tables for Razorpay/Stripe integration

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES public.reservations(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  gateway TEXT NOT NULL,
  gateway_transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT,
  payment_method_details JSONB,
  receipt TEXT,
  error_code TEXT,
  error_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  amount BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'issued',
  items JSONB NOT NULL,
  tax_details JSONB,
  total_amount BIGINT NOT NULL,
  paid_amount BIGINT NOT NULL DEFAULT 0,
  due_amount BIGINT NOT NULL DEFAULT 0,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id UUID REFERENCES public.payments(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL,
  amount BIGINT NOT NULL,
  status TEXT NOT NULL,
  gateway_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payment_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  gateway TEXT NOT NULL,
  payload JSONB NOT NULL,
  signature TEXT,
  processed BOOLEAN NOT NULL DEFAULT false,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.payment_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gateway TEXT NOT NULL UNIQUE,
  is_active BOOLEAN NOT NULL DEFAULT false,
  api_key_encrypted TEXT,
  api_secret_encrypted TEXT,
  webhook_secret TEXT,
  test_mode BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payments
CREATE POLICY "Admins read all payments" ON public.payments FOR SELECT USING (
  public.is_admin(auth.uid())
);

CREATE POLICY "Managers read all payments" ON public.payments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'manager' AND is_active = true
  )
);

CREATE POLICY "Agents read payments for their leads" ON public.payments FOR SELECT USING (
  lead_id IN (
    SELECT id FROM leads WHERE assigned_agent_id = (
      SELECT id FROM agents WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Admins manage payments" ON public.payments FOR ALL USING (
  public.is_admin(auth.uid())
);

-- RLS Policies for invoices
CREATE POLICY "Admins read all invoices" ON public.invoices FOR SELECT USING (
  public.is_admin(auth.uid())
);

CREATE POLICY "Managers read all invoices" ON public.invoices FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'manager' AND is_active = true
  )
);

CREATE POLICY "Agents read invoices for their leads" ON public.invoices FOR SELECT USING (
  lead_id IN (
    SELECT id FROM leads WHERE assigned_agent_id = (
      SELECT id FROM agents WHERE user_id = auth.uid()
    )
  )
);

CREATE POLICY "Admins manage invoices" ON public.invoices FOR ALL USING (
  public.is_admin(auth.uid())
);

-- RLS Policies for payment_transactions
CREATE POLICY "Admins read all payment transactions" ON public.payment_transactions FOR SELECT USING (
  public.is_admin(auth.uid())
);

CREATE POLICY "Managers read all payment transactions" ON public.payment_transactions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = auth.uid() AND role = 'manager' AND is_active = true
  )
);

CREATE POLICY "Agents read payment transactions for their leads" ON public.payment_transactions FOR SELECT USING (
  payment_id IN (
    SELECT id FROM payments WHERE lead_id IN (
      SELECT id FROM leads WHERE assigned_agent_id = (
        SELECT id FROM agents WHERE user_id = auth.uid()
      )
    )
  )
);

-- RLS Policies for payment_webhooks
CREATE POLICY "Admins read all webhooks" ON public.payment_webhooks FOR SELECT USING (
  public.is_admin(auth.uid())
);

CREATE POLICY "Admins manage webhooks" ON public.payment_webhooks FOR ALL USING (
  public.is_admin(auth.uid())
);

-- RLS Policies for payment_settings
CREATE POLICY "Admins read payment settings" ON public.payment_settings FOR SELECT USING (
  public.is_admin(auth.uid())
);

CREATE POLICY "Admins manage payment settings" ON public.payment_settings FOR ALL USING (
  public.is_admin(auth.uid())
);

-- Create trigger for updated_at
CREATE OR REPLACE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE OR REPLACE TRIGGER update_payment_settings_updated_at BEFORE UPDATE ON public.payment_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_payments_reservation_id ON public.payments(reservation_id);
CREATE INDEX IF NOT EXISTS idx_payments_lead_id ON public.payments(lead_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON public.payments(created_at);
CREATE INDEX IF NOT EXISTS idx_invoices_payment_id ON public.invoices(payment_id);
CREATE INDEX IF NOT EXISTS idx_invoices_booking_id ON public.invoices(booking_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON public.invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_payment_id ON public.payment_transactions(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_event_type ON public.payment_webhooks(event_type);
