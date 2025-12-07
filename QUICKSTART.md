# クイックスタートガイド

## 🚀 5 分で始める

### 1. 必要なツールのインストール

```powershell
# Rust のインストール（公式サイトから）
# https://www.rust-lang.org/tools/install

# wasm-pack のインストール
cargo install wasm-pack
```

### 2. ビルド

```powershell
# プロジェクトディレクトリで実行
.\build.ps1
```

### 3. サーバー起動

```powershell
# Webサーバーを起動
.\serve.ps1
```

### 4. ブラウザで開く

```
http://localhost:8080
```

---

## 📝 手動でビルド・起動する場合

```powershell
# ビルド
wasm-pack build --target web --release

# サーバー起動
cd www
python -m http.server 8080

# ブラウザで開く
# http://localhost:8080
```

---

## 🐛 トラブルシューティング

### ビルドエラー

- `wasm-pack` がインストールされているか確認
- Rust のバージョンを最新に: `rustup update`

### ページが表示されない

- `pkg/` フォルダが生成されているか確認
- ブラウザのコンソール（F12）でエラーを確認

### WASM が読み込めない

- ファイルパスが正しいか確認（`app.js` の import 文）
- CORS エラーの場合は必ずローカルサーバー経由でアクセス

---

## 🎓 学習の進め方

1. **まずは動かしてみる**  
   ビルド → サーバー起動 → ブラウザで動作確認

2. **コードを読む**  
   `src/lib.rs` → Rust のロジック  
   `www/app.js` → JavaScript 連携

3. **機能を追加してみる**

   - 新しいエンコード方式を追加
   - UI の改善
   - エラーハンドリングの強化

4. **テストを書く**  
   `cargo test` で Rust 側のテストを実行

Happy Learning! 🦀
