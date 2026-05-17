param (
    [int]$Port = 8080
)

Write-Host "Searching for processes using port $Port..." -ForegroundColor Cyan

$connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue

if ($connections) {
    $pids = $connections.OwningProcess | Select-Object -Unique
    foreach ($targetPid in $pids) {
        $process = Get-Process -Id $targetPid -ErrorAction SilentlyContinue
        if ($process) {
            Write-Host "Killing process: $($process.Name) (PID: $targetPid) occupying port $Port..." -ForegroundColor Yellow
            Stop-Process -Id $targetPid -Force
        }
    }
    Write-Host "Port $Port is now free!" -ForegroundColor Green
} else {
    Write-Host "No active processes found on port $Port." -ForegroundColor Green
}
