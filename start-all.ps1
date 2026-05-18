$ScriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting Sama Salalah in separate PowerShell windows..." -ForegroundColor Green
Write-Host "Project path: $ScriptPath" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd '$ScriptPath'; npm run dev:api"
Start-Process powershell -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", "cd '$ScriptPath'; npm run dev:web"

Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"
Start-Process "http://localhost:4000"

Write-Host "API and Web started in separate windows." -ForegroundColor Green
Write-Host "You can continue typing in this PowerShell window." -ForegroundColor Yellow
