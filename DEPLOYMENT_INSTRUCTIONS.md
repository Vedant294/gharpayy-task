# Gharpayy Deployment Instructions

## ⚠️ Important: Supabase Project is Paused

Your Supabase project `kmwugwbbasdjeulkrwiq` is currently **paused**. You need to unpause it first.

### Step 1: Unpause Supabase Project

1. Go to: https://supabase.com/dashboard/project/kmwugwbbasdjeulkrwiq
2. Click on **Settings** (left sidebar)
3. Click on **Database** 
4. Scroll down to **Database Connection**
5. Click **Unpause Database** button

### Step 2: Install Supabase CLI

**Option A: Using npm**
```bash
npm install -g supabase
```

**Option B: Using Homebrew (Mac/Linux)**
```bash
brew install supabase/tap/supabase
```

**Option C: Using Windows (Scoop)**
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### Step 3: Link Your Project

```bash
supabase link --project-ref kmwugwbbasdjeulkrwiq
```

### Step 4: Run Database Migrations

```bash
supabase db push
```

This will create:
- `user_roles` table
- `permissions` table
- `payments` table
- `invoices` table
- Updated RLS policies

### Step 5: Deploy Edge Functions

```bash
supabase functions deploy receive-lead --project-ref kmwugwbbasdjeulkrwiq
supabase functions deploy ai-lead-summary --project-ref kmwugwbbasdjeulkrwiq
supabase functions deploy ai-suggest-reply --project-ref kmwugwbbasdjeulkrwiq
supabase functions deploy automation-jobs --project-ref kmwugwbbasdjeulkrwiq
supabase functions deploy confirm-room --project-ref kmwugwbbasdjeulkrwiq
```

### Step 6: Set Environment Variables

In Supabase Dashboard → Settings → Environment Variables:
```
LOVABLE_API_KEY=your-lovable-api-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 7: Build and Deploy Frontend

```bash
npm run build
```

Then deploy the `dist/` folder to Netlify.

---

## Quick Commands Reference

```bash
# Link project
supabase link --project-ref kmwugwbbasdjeulkrwiq

# Run migrations
supabase db push

# Deploy all functions
supabase functions deploy --all --project-ref kmwugwbbasdjeulkrwiq

# Build frontend
npm run build

# Preview build
npm run preview
```

---

## Verify Deployment

After deployment, verify:

1. **Database Tables**: Check Supabase Dashboard → Table Editor
   - `user_roles`
   - `permissions`
   - `payments`
   - `invoices`

2. **Edge Functions**: Check Supabase Dashboard → Edge Functions
   - `receive-lead`
   - `ai-lead-summary`
   - `ai-suggest-reply`
   - `automation-jobs`
   - `confirm-room`

3. **Test RBAC**: Create test users with different roles and verify access

---

## Need Help?

Check the logs:
```bash
supabase functions logs <function-name> --project-ref kmwugwbbasdjeulkrwiq
```
