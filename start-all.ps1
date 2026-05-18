$ProjectPath = $PSScriptRoot

if (-not $ProjectPath) {
  $ProjectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
}

Write-Host "Starting Sama Salalah..." -ForegroundColor Green
Write-Host "Project path: $ProjectPath" -ForegroundColor Cyan

$ApiCommand = "Set-Location -LiteralPath `"$ProjectPath`"; npm run dev:api"
$WebCommand = "Set-Location -LiteralPath `"$ProjectPath`"; npm run dev:web"

Start-Process -FilePath "powershell.exe" -ArgumentList @("-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $ApiCommand)
Start-Process -FilePath "powershell.exe" -ArgumentList @("-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $WebCommand)

Start-Sleep -Seconds 5
Start-Process "http://localhost:3000"
Start-Process "http://localhost:4000"

Write-Host "Done. API and Web opened in separate windows." -ForegroundColor Green
Write-Host "This window is still ready for commands." -ForegroundColor Yellow
