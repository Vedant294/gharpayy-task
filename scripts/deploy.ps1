# Gharpayy Production Deployment Script (Windows)

Write-Host "🚀 Gharpayy Production Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if Supabase CLI is installed
Write-Host "Checking Supabase CLI..."
if (-not (Get-Command supabase -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Supabase CLI..." -ForegroundColor Yellow
    npm install -g supabase
}

# Link project
Write-Host "Linking Supabase project..." -ForegroundColor Cyan
supabase link --project-ref kmwugwbbasdjeulkrwiq

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Project is paused. Please unpause from:" -ForegroundColor Yellow
    Write-Host "https://supabase.com/dashboard/project/kmwugwbbasdjeulkrwiq" -ForegroundColor Cyan
    Write-Host "Then run this script again." -ForegroundColor Yellow
    exit 1
}

# Run migrations
Write-Host "Running database migrations..." -ForegroundColor Cyan
supabase db push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Migration failed. Check errors above." -ForegroundColor Red
    exit 1
}

# Deploy edge functions
Write-Host "Deploying edge functions..." -ForegroundColor Cyan

supabase functions deploy receive-lead --project-ref kmwugwbbasdjeulkrwiq
supabase functions deploy ai-lead-summary --project-ref kmwugwbbasdjeulkrwiq
supabase functions deploy ai-suggest-reply --project-ref kmwugwbbasdjeulkrwiq
supabase functions deploy automation-jobs --project-ref kmwugwbbasdjeulkrwiq
supabase functions deploy confirm-room --project-ref kmwugwbbasdjeulkrwiq

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Edge function deployment failed. Check errors above." -ForegroundColor Red
    exit 1
}

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Check errors above." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Set environment variables in Supabase dashboard"
Write-Host "2. Deploy frontend to Netlify"
Write-Host "3. Configure Razorpay payment gateway"
Write-Host "4. Test the application"
