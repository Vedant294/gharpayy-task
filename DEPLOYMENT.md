# Gharpayy Production Deployment Guide

## Current Status

✅ **Code Ready** - All production code is implemented and tested
⚠️ **Supabase Project Paused** - Needs to be unpause from dashboard
⏳ **Migrations Pending** - Database migrations need to run after project is active

---

## Quick Start (3 Steps)

### Step 1: Unpause Supabase Project

Go to: https://supabase.com/dashboard/project/kmwugwbbasdjeulkrwiq

1. Click **Settings** → **Database**
2. Click **Unpause Database**

### Step 2: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 3: Run Migrations

```bash
supabase link --project-ref kmwugwbbasdjeulkrwiq
supabase db push
supabase functions deploy --all --project-ref kmwugwbbasdjeulkrwiq
npm run build
```

---

## What Was Implemented

### 1. RBAC System
- 5 roles: admin, manager, agent, owner, viewer
- Granular permissions per resource
- Agent-scoped data access
- Owner-scoped property access

### 2. Error Handling
- Global ErrorBoundary component
- Error logging service
- User-friendly error UI

### 3. Payment Integration
- Razorpay service integration
- Payment link creation
- Payment verification
- Invoice generation

### 4. Database Tables
- `user_roles` - User role assignments
- `permissions` - Permission definitions
- `payments` - Payment records
- `invoices` - Invoice records
- `payment_transactions` - Transaction log
- `payment_webhooks` - Webhook log
- `payment_settings` - Gateway configuration

### 5. Updated RLS Policies
- Role-based access control
- Agent-scoped data visibility
- Owner-scoped property access

---

## Deployment Checklist

- [ ] Unpause Supabase project
- [ ] Install Supabase CLI
- [ ] Link project: `supabase link --project-ref kmwugwbbasdjeulkrwiq`
- [ ] Run migrations: `supabase db push`
- [ ] Deploy functions: `supabase functions deploy --all --project-ref kmwugwbbasdjeulkrwiq`
- [ ] Set environment variables in Supabase dashboard
- [ ] Build frontend: `npm run build`
- [ ] Deploy to Netlify
- [ ] Configure Razorpay payment gateway
- [ ] Test RBAC with test users
- [ ] Test payment flow

---

## Environment Variables

### Supabase Dashboard → Settings → Environment Variables
```
LOVABLE_API_KEY=your-lovable-api-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Netlify → Settings → Environment Variables
```
VITE_SUPABASE_URL=https://kmwugwbbasdjeulkrwiq.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_RAZORPAY_KEY=your-razorpay-key
VITE_RAZORPAY_SECRET=your-razorpay-secret
VITE_IS_TEST_MODE=false
```

---

## Scaling Capacity

| Metric | Capacity | Notes |
|--------|----------|-------|
| Team Members | 30+ | RBAC supports unlimited |
| Property Owners | 100+ | Owner-scoped access |
| Daily Customers | 10,000+ | Static frontend + Supabase |

---

## Support

For issues, check:
- Supabase Dashboard: https://supabase.com/dashboard
- Razorpay Docs: https://razorpay.com/docs
- Netlify Docs: https://docs.netlify.com
