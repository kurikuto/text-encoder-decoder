# 🦀 Web テキストエンコーダ・デコーダ（TypeScript 版 - 初学者向け）

Rust + WebAssembly + TypeScript で構築した、テキストエンコード・デコードツールです。  
**初学者でも理解しやすいよう、コード内に詳細なコメントと説明を記載しています。**

![Rust](https://img.shields.io/badge/Rust-1.75+-000000?style=for-the-badge&logo=rust&logoColor=white)
![WebAssembly](https://img.shields.io/badge/WebAssembly-654FF0?style=for-the-badge&logo=webassembly&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)

---

## 📋 目次

- [機能](#-機能)
- [このプロジェクトで学べること](#-このプロジェクトで学べること)
- [必要なもの](#-必要なもの)
- [5 分で始めるクイックスタート](#-5分で始めるクイックスタート)
- [プロジェクト構成](#-プロジェクト構成)
- [TypeScript とは？](#-typescriptとは)
- [実装の学習ポイント](#-実装の学習ポイント)
- [よくある質問](#-よくある質問)
- [トラブルシューティング](#-トラブルシューティング)
- [次のステップ](#-次のステップ)

---

## ✨ 機能

このツールは、テキストデータを様々な形式に変換できます：

### 実装済み機能

- **Base64 エンコード/デコード**

  - 「Hello」→「SGVsbG8=」のように変換
  - メールの添付ファイルや Web API でよく使われます

- **URL エンコード/デコード**

  - 「こんにちは」→「%E3%81%93%E3%82%93...」のように変換
  - URL に日本語を使うときに必須です

- **HEX（16 進数）変換**

  - 「ABC」→「414243」のように変換
  - プログラムのデバッグでよく使います

- **可逆性テスト**
  - エンコード → デコードで元に戻るか確認
  - データが正しく変換されているかチェックできます

---

## 🎓 このプロジェクトで学べること

### 初学者にやさしいポイント

1. **コード内に詳しいコメント**

   - すべての関数に「何をするか」を説明
   - なぜそのコードが必要かも解説

2. **TypeScript の基礎**

   - 型（Type）とは何か
   - なぜ型を使うと良いのか
   - エディタの補完機能が効く様子を体験

3. **Rust + WebAssembly の連携**

   - Rust のコードがブラウザでどの JavaScript と連携するか
   - WASM の高速処理を体感

4. **実務的なパターン**
   - エラーハンドリング
   - DOM 操作の型安全な方法
   - ログ出力の実装

---

## 🛠 必要なもの

### 1. Rust（必須）

```powershell
# 公式サイトからインストール
# https://www.rust-lang.org/tools/install

# インストール後、確認
rustc --version
```

### 2. wasm-pack（必須）

```powershell
# Rustをインストール後に実行
cargo install wasm-pack

# 確認
wasm-pack --version
```

### 3. Node.js（必須 - TypeScript 用）

```powershell
# 公式サイトからLTS版をインストール
# https://nodejs.org/

# 確認
node --version  # v18以上
npm --version   # 9以上
```

### 4. Python（オプション - サーバー起動用）

```powershell
# Windows 10/11には通常インストール済み
python --version
```

💡 **初心者へのヒント**: すべて無料で使えるツールです！

---

## 🚀 5 分で始めるクイックスタート

### ステップ 1: 依存関係のインストール

```powershell
# プロジェクトフォルダに移動
cd text-encoder-decoder

# Node.jsのパッケージをインストール
npm install
```

これで、TypeScript のコンパイラなど必要なツールがインストールされます。

### ステップ 2: ビルド

```powershell
# 統合ビルドスクリプトを実行
.\build.ps1
```

または手動でステップ実行：

```powershell
# 方法1: 一括ビルド
npm run build

# 方法2: 個別にビルド
npm run build:wasm  # Rust → WASM
npm run build:ts    # TypeScript → JavaScript
```

**何が起こっているか**:

1. Rust のコード（`src/lib.rs`）が WebAssembly にコンパイル → `pkg/` フォルダ
2. TypeScript（`www/app.ts`）が JavaScript にトランスパイル → `www/dist/` フォルダ

### ステップ 3: サーバー起動

```powershell
# サーバー起動スクリプトを実行
.\serve.ps1

# または
npm run serve
```

### ステップ 4: ブラウザで開く

```
http://localhost:8080
```

🎉 完成です！テキストを入力して、エンコード/デコードしてみましょう。

---

## 📁 プロジェクト構成

### 実装済み機能

- **Base64 エンコード/デコード**

  - バイナリデータをテキスト形式で表現
  - メール添付、API 通信で頻繁に使用
  - RFC 4648 準拠

- **URL エンコード/デコード**

  - URL 安全な文字列への変換
  - 日本語 URL やクエリパラメータで必須
  - RFC 3986 準拠

- **HEX（16 進数）変換**

  - バイト列を 16 進数で表現
  - デバッグ、暗号化処理で活用
  - 大文字・小文字対応

- **可逆性テスト**
  - エンコード → デコードで元に戻ることを確認
  - データ整合性の検証に有用
  - 単体テストの実装例

---

## 🛠 技術スタック

### バックエンド（Rust）

- **Rust 1.75+** - システムプログラミング言語
- **wasm-bindgen 0.2** - Rust/JavaScript 相互運用
- **wasm-pack** - WASM ビルドツール

### フロントエンド（TypeScript）

- **TypeScript 5.7+** - 型安全な JavaScript
- **ES2022** - モダンな JavaScript 機能
- **Strict Mode** - 最高レベルの型チェック

### 依存ライブラリ（Rust）

- `base64 0.21` - Base64 エンコード/デコード
- `urlencoding 2.1` - URL エンコード/デコード
- `hex 0.4` - 16 進数変換
- `serde 1.0` - シリアライゼーション
- `web-sys` - Web API バインディング

---

## 📁 プロジェクト構成

```
text-encoder-decoder/
├── Cargo.toml              # Rustの依存関係設定
├── src/
│   └── lib.rs             # Rustのメインロジック（WASM化）
├── www/
│   ├── index.html         # Webインターフェース
│   ├── style.css          # スタイルシート
│   └── app.js             # JavaScript（WASM連携）
├── pkg/                   # ビルド後に生成（WASMファイル）
└── README.md              # このファイル
```

### 各ファイルの役割

| ファイル         | 役割                               | 学習ポイント                     |
| ---------------- | ---------------------------------- | -------------------------------- |
| `src/lib.rs`     | Rust のエンコード/デコードロジック | エラーハンドリング、wasm-bindgen |
| `www/index.html` | Web UI                             | HTML 構造、セマンティック        |
| `www/style.css`  | スタイリング                       | CSS Grid、レスポンシブ           |
| `www/app.js`     | WASM 連携                          | ES6 モジュール、async/await      |
| `Cargo.toml`     | 依存関係管理                       | Rust のパッケージ管理            |

---

## 🚀 セットアップ

### 前提条件

以下のツールをインストールしてください：

1. **Rust**

   ```powershell
   # Rustupのインストール（公式サイトから）
   # https://www.rust-lang.org/tools/install

   # インストール確認
   rustc --version
   cargo --version
   ```

2. **wasm-pack**

   ```powershell
   # wasm-packのインストール
   cargo install wasm-pack

   # インストール確認
   wasm-pack --version
   ```

3. **ローカルサーバー（任意）**

   ```powershell
   # Python（既にインストール済みの場合）
   python -m http.server 8080

   # または Node.js の http-server
   npm install -g http-server
   http-server www -p 8080
   ```

### ビルド手順

```powershell
# 1. プロジェクトディレクトリに移動
cd text-encoder-decoder

# 2. WASMとしてビルド（リリースモード推奨）
wasm-pack build --target web --release

# 3. ビルド成功後、pkg/ フォルダが生成される
# pkg/text_encoder_decoder.js
# pkg/text_encoder_decoder_bg.wasm など

# 4. Webサーバーを起動（wwwディレクトリをルートに）
# 方法1: Python
cd www
python -m http.server 8080

# 方法2: Node.js
# http-server www -p 8080

# 5. ブラウザで開く
# http://localhost:8080
```

### ビルドオプション

```powershell
# 開発用（デバッグ情報付き）
wasm-pack build --target web --dev

# リリース用（最適化、サイズ削減）
wasm-pack build --target web --release

# ビルド後のクリーンアップ
cargo clean
```

---

## 📖 使い方

### 基本操作

1. **テキスト入力**  
   エンコード/デコードしたいテキストを入力欄に入力

2. **変換方式選択**

   - Base64
   - URL エンコード
   - HEX (16 進数)

3. **変換実行**

   - **エンコード**: 平文 → 変換形式
   - **デコード**: 変換形式 → 平文
   - **可逆性テスト**: エンコード → デコードで元に戻るか確認

4. **結果確認**  
   変換結果が出力エリアに表示されます

### 実行例

#### Base64 エンコード

```
入力: Hello, Rust WASM!
出力: SGVsbG8sIFJ1c3QgV0FTTSE=
```

#### URL エンコード

```
入力: こんにちは 世界
出力: %E3%81%93%E3%82%93%E3%81%AB%E3%81%A1%E3%81%AF%20%E4%B8%96%E7%95%8C
```

#### HEX 変換

```
入力: Test123
出力: 5465737431323333
```

---

## 🎓 実装の学習ポイント

### Rust 側（src/lib.rs）

1. **wasm-bindgen の使い方**

   ```rust
   #[wasm_bindgen]
   pub fn base64_encode(input: &str) -> EncodeResult {
       // JavaScriptから呼び出せる関数
   }
   ```

2. **エラーハンドリング**

   ```rust
   match general_purpose::STANDARD.decode(input) {
       Ok(decoded) => { /* 成功 */ },
       Err(e) => { /* エラー処理 */ }
   }
   ```

3. **構造体の公開**
   ```rust
   #[wasm_bindgen]
   pub struct EncodeResult {
       success: bool,
       result: String,
       error: String,
   }
   ```

### JavaScript 側（www/app.js）

1. **動的インポート**

   ```javascript
   import init, { base64_encode } from "../pkg/text_encoder_decoder.js";
   await init(); // WASMモジュール初期化
   ```

2. **WASM 関数の呼び出し**

   ```javascript
   const result = base64_encode("Hello");
   if (result.success) {
     console.log(result.result);
   }
   ```

3. **エラーハンドリング**
   ```javascript
   try {
     const result = base64_decode(input);
     if (!result.success) {
       displayError(result.error);
     }
   } catch (error) {
     console.error(error);
   }
   ```

---

## 💼 実務での応用例

### 1. API 開発

```javascript
// JWTトークンのペイロード確認
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
const [header, payload, signature] = token.split(".");
const decoded = base64_decode(payload);
console.log(JSON.parse(decoded.result));
```

### 2. Web フォーム

```javascript
// ファイルアップロード前にBase64エンコード
const fileContent = await file.text();
const encoded = base64_encode(fileContent);
// APIに送信
```

### 3. デバッグ

```javascript
// APIレスポンスのバイナリデータ確認
const hexData = "48656C6C6F";
const decoded = hex_decode(hexData);
console.log(decoded.result); // "Hello"
```

### 4. データベース保存

```javascript
// バイナリデータをBase64でDB保存
const binaryData = new Uint8Array([...]);
const encoded = base64_encode(String.fromCharCode(...binaryData));
// DBに保存
```

---

## 🔧 拡張アイデア

### 初級

- [ ] コピーボタンの追加（結果をクリップボードにコピー）
- [ ] エンコード履歴の保存（LocalStorage）
- [ ] ダークモード対応

### 中級

- [ ] ファイルアップロード対応（画像の Base64 変換など）
- [ ] SHA-256, MD5 ハッシュ機能
- [ ] JWT トークンのデコード機能

### 上級

- [ ] AES 暗号化/復号化
- [ ] バイナリデータのビジュアライザー
- [ ] パフォーマンス比較（Rust WASM vs JavaScript）

---

## 📚 参考資料

### 公式ドキュメント

- [Rust 公式サイト](https://www.rust-lang.org/ja)
- [wasm-bindgen](https://rustwasm.github.io/wasm-bindgen/)
- [The Rust and WebAssembly Book](https://rustwasm.github.io/docs/book/)

### 使用ライブラリ

- [base64](https://docs.rs/base64/)
- [urlencoding](https://docs.rs/urlencoding/)
- [hex](https://docs.rs/hex/)

---

## 🧪 テスト

### Rust のユニットテスト

```powershell
# すべてのテストを実行
cargo test

# 特定のテストのみ実行
cargo test test_base64_encode_decode
```

### ブラウザでの動作確認

1. 開発者ツールのコンソールを開く（F12）
2. `window.encoderApp` でメソッドにアクセス可能
   ```javascript
   // コンソールから直接実行
   window.encoderApp.encode();
   window.encoderApp.decode();
   ```

---

## 🤝 コントリビューション

学習目的のプロジェクトですが、改善提案やバグ報告は歓迎します！

---

## 📝 ライセンス

MIT License

---

## 🎉 おわりに

このプロジェクトを通じて、以下を実践的に学べます：

- ✅ Rust の基本的な文法とエラーハンドリング
- ✅ WebAssembly へのコンパイルとビルドプロセス
- ✅ wasm-bindgen による JavaScript 連携
- ✅ 実務で使えるエンコード/デコード処理
- ✅ Web アプリケーションの基本構造

さらなる学習のため、ぜひ拡張機能の実装にチャレンジしてみてください！

Happy Coding! 🚀🦀
