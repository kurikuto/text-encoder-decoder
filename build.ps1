# ビルドスクリプト (PowerShell) - TypeScript版
# Rust + WASM + TypeScriptプロジェクトのビルドを実行

Write-Host "🦀 Rust + WASM + TypeScript ビルド開始..." -ForegroundColor Cyan
Write-Host ""

# Node.jsとnpmの確認
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ エラー: Node.js がインストールされていません" -ForegroundColor Red
    Write-Host "https://nodejs.org/ からインストールしてください" -ForegroundColor Yellow
    exit 1
}

# wasm-packの確認
if (-not (Get-Command wasm-pack -ErrorAction SilentlyContinue)) {
    Write-Host "❌ エラー: wasm-pack がインストールされていません" -ForegroundColor Red
    Write-Host "以下のコマンドでインストールしてください:" -ForegroundColor Yellow
    Write-Host "cargo install wasm-pack" -ForegroundColor Yellow
    exit 1
}

# 依存関係のインストール確認
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 依存関係をインストール中..." -ForegroundColor Green
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install が失敗しました" -ForegroundColor Red
        exit 1
    }
}

# 1. RustコードをWASMとしてビルド
Write-Host "📦 Step 1/2: Rust → WASM ビルド中..." -ForegroundColor Green
wasm-pack build --target web --release

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ WASMビルドが失敗しました" -ForegroundColor Red
    exit 1
}

Write-Host "✅ WASMビルド成功" -ForegroundColor Green
Write-Host ""

# 2. TypeScriptをJavaScriptにトランスパイル
Write-Host "📦 Step 2/2: TypeScript → JavaScript トランスパイル中..." -ForegroundColor Green
npm run build:ts

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ TypeScriptのビルドが失敗しました" -ForegroundColor Red
    exit 1
}

Write-Host "✅ TypeScriptビルド成功" -ForegroundColor Green
Write-Host ""
Write-Host "🎉 すべてのビルドが完了しました！" -ForegroundColor Cyan
Write-Host ""
Write-Host "次のステップ:" -ForegroundColor Cyan
Write-Host "1. .\serve.ps1       # サーバーを起動" -ForegroundColor White
Write-Host "   または" -ForegroundColor Gray
Write-Host "   npm run serve     # サーバーを起動" -ForegroundColor White
Write-Host "" 
Write-Host "2. ブラウザで http://localhost:8080 を開く" -ForegroundColor White
