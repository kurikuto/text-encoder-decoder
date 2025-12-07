# TypeScript 版 クイックスタートガイド（初学者向け）

## 🎯 このガイドについて

このガイドでは、**プログラミング初心者でも**TypeScript 版のテキストエンコーダを動かせるよう、手順を詳しく説明します。

---

## 📝 事前準備

以下のツールをインストールしてください（すべて無料です）：

### 1. Rust

```powershell
# 公式サイトからインストーラーをダウンロード
# https://www.rust-lang.org/tools/install
#
# インストール後、PowerShellを再起動して確認
rustc --version
cargo --version
```

### 2. wasm-pack

```powershell
# Rustをインストール後に実行
cargo install wasm-pack

# 確認（少し時間がかかります）
wasm-pack --version
```

### 3. Node.js

```powershell
# 公式サイトからLTS版（推奨版）をダウンロード
# https://nodejs.org/
#
# インストール後、確認
node --version   # v18.0.0 以上であればOK
npm --version    # 9.0.0 以上であればOK
```

### 4. Python（オプション）

```powershell
# Windows 10/11には最初から入っています
python --version

# もし入っていなければ Microsoft Store からインストール
```

---

## 🚀 実行手順

### ステップ 1: 依存関係のインストール

```powershell
# プロジェクトフォルダに移動
cd text-encoder-decoder

# TypeScriptなどのツールをインストール
npm install
```

**何が起こるか**: `node_modules/` フォルダが作られ、必要なツールがダウンロードされます。

### ステップ 2: ビルド

```powershell
# ビルドスクリプトを実行
.\build.ps1
```

**何が起こるか**:

1. Rust のコードが WebAssembly（WASM）にコンパイルされます → `pkg/` フォルダに出力
2. TypeScript が JavaScript にトランスパイル（変換）されます → `www/dist/` フォルダに出力

**時間**: 初回は 3-5 分かかります（2 回目以降は数秒）

### ステップ 3: サーバー起動

```powershell
# サーバー起動スクリプトを実行
.\serve.ps1
```

**何が起こるか**: ローカル Web サーバーが起動し、`http://localhost:8080` でアクセスできるようになります。

### ステップ 4: ブラウザで開く

```
http://localhost:8080
```

ブラウザで開くと、テキストエンコーダの画面が表示されます！

---

## 💡 使い方

1. **テキスト入力欄**に変換したいテキストを入力
2. **変換方式**を選択（Base64 / URL / HEX）
3. **エンコードボタン**または**デコードボタン**をクリック
4. 結果が下に表示されます

### ショートカット

- `Ctrl + Enter`: エンコード実行

---

## 🔍 ファイルを読んで学習する順番

### 初心者におすすめの順番

1. **`www/types.ts`** から読み始める

   - TypeScript の「型」がよくわかる
   - コメントが詳しい

2. **`www/app.ts`** を読む

   - メインのロジック
   - 各関数に詳しい説明がある

3. **`src/lib.rs`** を読む
   - Rust 側の実装
   - WASM 向けの書き方がわかる

---

## ⚙️ 開発モード（コードを変更しながら学習）

### TypeScript の変更を自動検知

```powershell
# ターミナル1
npm run dev

# ターミナル2
npm run serve
```

`npm run dev` を実行すると、TypeScript ファイル（`app.ts` や `types.ts`）を保存するたびに、自動的に JavaScript に変換されます。

---

## 🐛 トラブルシューティング

### エラー: `wasm-pack: command not found`

**原因**: wasm-pack がインストールされていない  
**解決方法**:

```powershell
cargo install wasm-pack
```

### エラー: `tsc: command not found`

**原因**: TypeScript がインストールされていない  
**解決方法**:

```powershell
npm install
```

### エラー: PowerShell スクリプトが実行できない

**原因**: 実行ポリシーが制限されている  
**解決方法**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### ページが真っ白

**原因**: ビルドが完了していない  
**解決方法**:

1. `pkg/` フォルダがあるか確認
2. `www/dist/` フォルダがあるか確認
3. なければ `npm run build` を実行

### CORS エラー

**原因**: ファイルを直接開いている（`file://`）  
**解決方法**: 必ずローカルサーバー経由で開く（`http://localhost:8080`）

---

## 🎓 TypeScript について学ぶ

### TypeScript とは？

JavaScript に「型」を追加した言語です。

**JavaScript（型なし）**:

```javascript
function greet(name) {
  return "Hello, " + name;
}

greet(123); // エラーにならない（でも変な結果に）
```

**TypeScript（型あり）**:

```typescript
function greet(name: string): string {
  return "Hello, " + name;
}

greet(123); // ❌ コンパイルエラー！数値は渡せない
greet("太郎"); // ✅ OK
```

### TypeScript を使うメリット

1. **エラーを早く見つけられる**

   - コードを書いている時点でエラーがわかる
   - 実行前に問題を発見

2. **エディタの補完が効く**

   - 関数やプロパティ名を自動補完
   - ドキュメントがその場で見られる

3. **コードが読みやすい**
   - 型を見れば「何を渡すべきか」がわかる
   - 大きなプロジェクトでも迷わない

---

## 📚 さらに学習する

### 公式ドキュメント

- [Rust 公式](https://www.rust-lang.org/ja/learn)
- [TypeScript 公式](https://www.typescriptlang.org/docs/)
- [WebAssembly 入門](https://rustwasm.github.io/docs/book/)

### 次のチャレンジ

- [ ] コピーボタンを追加してみる
- [ ] ダークモードを実装してみる
- [ ] 新しいエンコード方式を追加してみる
- [ ] エラーメッセージを日本語以外にしてみる

---

## ❓ よくある質問

### Q: プログラミング初心者でも大丈夫？

A: はい！コード内に詳しいコメントがあり、このガイドに従えば動かせます。

### Q: Rust と TypeScript、両方学ぶ必要がある？

A: まずは片方から始めて OK。TypeScript の部分（`www/app.ts`）だけ読んで学習することもできます。

### Q: JavaScript 版とどう違う？

A: 型チェックがあるかどうかです。機能は同じです。

### Q: 実務で使える？

A: はい！型安全性が高く、実務のプロジェクトでも使われる書き方です。

---

Happy Learning! 🦀🎯

**困ったことがあれば、README.md の「トラブルシューティング」も見てください！**
