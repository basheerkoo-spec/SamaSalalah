$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptPath

Write-Host "Starting Sama Salalah API..." -ForegroundColor Green
Write-Host "Project path: $ScriptPath" -ForegroundColor Cyan

npm run dev:api
