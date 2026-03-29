# Run Database Migrations for Gharpayy

Write-Host "📝 Running database migrations..." -ForegroundColor Cyan

# Run migrations
supabase db push

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migrations completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next: Deploy edge functions with:" -ForegroundColor Cyan
    Write-Host "  supabase functions deploy --all --project-ref kmwugwbbasdjeulkrwiq"
} else {
    Write-Host "❌ Migration failed. Check errors above." -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "  1. Project is paused - unpause from Supabase dashboard"
    Write-Host "  2. Not linked - run: supabase link --project-ref kmwugwbbasdjeulkrwiq"
    Write-Host "  3. Supabase CLI not installed - install with: npm install -g supabase"
}
