#!/bin/bash

echo "🚀 Gharpayy Production Deployment Script"
echo "========================================"

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Link project
echo "🔗 Linking Supabase project..."
supabase link --project-ref kmwugwbbasdjeulkrwiq

if [ $? -ne 0 ]; then
    echo "⚠️  Project is paused. Please unpause from: https://supabase.com/dashboard/project/kmwugwbbasdjeulkrwiq"
    echo "Then run this script again."
    exit 1
fi

# Run migrations
echo "📝 Running database migrations..."
supabase db push

if [ $? -ne 0 ]; then
    echo "❌ Migration failed. Check errors above."
    exit 1
fi

# Deploy edge functions
echo "🚀 Deploying edge functions..."

supabase functions deploy receive-lead --project-ref kmwugwbbasdjeulkrwiq
supabase functions deploy ai-lead-summary --project-ref kmwugwbbasdjeulkrwiq
supabase functions deploy ai-suggest-reply --project-ref kmwugwbbasdjeulkrwiq
supabase functions deploy automation-jobs --project-ref kmwugwbbasdjeulkrwiq
supabase functions deploy confirm-room --project-ref kmwugwbbasdjeulkrwiq

if [ $? -ne 0 ]; then
    echo "❌ Edge function deployment failed. Check errors above."
    exit 1
fi

# Build frontend
echo "🔨 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Check errors above."
    exit 1
fi

echo "✅ Deployment complete!"
echo ""
echo "Next steps:"
echo "1. Set environment variables in Supabase dashboard"
echo "2. Deploy frontend to Netlify"
echo "3. Configure Razorpay payment gateway"
echo "4. Test the application"
