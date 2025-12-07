# サーバー起動スクリプト (PowerShell)
# Webサーバーを起動してアプリケーションをブラウザで表示

param(
    [int]$Port = 8080
)

Write-Host "🌐 Webサーバー起動中..." -ForegroundColor Cyan
Write-Host "ポート: $Port" -ForegroundColor White

# wwwディレクトリの確認
if (-not (Test-Path "www")) {
    Write-Host "❌ エラー: www ディレクトリが見つかりません" -ForegroundColor Red
    exit 1
}

# pkgディレクトリの確認（ビルド済みか）
if (-not (Test-Path "pkg")) {
    Write-Host "⚠️  警告: pkg ディレクトリが見つかりません" -ForegroundColor Yellow
    Write-Host "先に build.ps1 を実行してビルドしてください" -ForegroundColor Yellow
    Write-Host ""
    $response = Read-Host "今すぐビルドしますか？ (Y/n)"
    if ($response -eq "" -or $response -eq "Y" -or $response -eq "y") {
        .\build.ps1
        if ($LASTEXITCODE -ne 0) {
            exit 1
        }
    } else {
        exit 1
    }
}

# Pythonの確認
if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "✅ Python サーバーを起動します" -ForegroundColor Green
    Write-Host ""
    Write-Host "📂 http://localhost:$Port でアクセス可能です" -ForegroundColor Cyan
    Write-Host "🛑 停止するには Ctrl+C を押してください" -ForegroundColor Yellow
    Write-Host ""
    
    Set-Location www
    python -m http.server $Port
} else {
    Write-Host "❌ エラー: Python が見つかりません" -ForegroundColor Red
    Write-Host "以下の方法でWebサーバーを起動してください:" -ForegroundColor Yellow
    Write-Host "1. Python をインストール: https://www.python.org/" -ForegroundColor White
    Write-Host "2. または Node.js の http-server を使用:" -ForegroundColor White
    Write-Host "   npm install -g http-server" -ForegroundColor White
    Write-Host "   http-server www -p $Port" -ForegroundColor White
    exit 1
}
