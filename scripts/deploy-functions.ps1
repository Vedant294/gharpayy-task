# Deploy Edge Functions for Gharpayy

Write-Host "🚀 Deploying edge functions..." -ForegroundColor Cyan

# Deploy all functions
supabase functions deploy --all --project-ref kmwugwbbasdjeulkrwiq

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ All edge functions deployed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next: Build frontend with:" -ForegroundColor Cyan
    Write-Host "  npm run build"
} else {
    Write-Host "❌ Function deployment failed. Check errors above." -ForegroundColor Red
}
