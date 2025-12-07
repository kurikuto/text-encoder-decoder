# 🎯 完全初心者向け セットアップガイド

このガイドは、**プログラミングを始めたばかりの方**でも、このプロジェクトを動かせるように作りました。

---

## ✅ チェックリスト

このプロジェクトを動かすには、以下のツールが必要です：

- [ ] Rust
- [ ] wasm-pack
- [ ] Node.js
- [ ] Python（オプション）

すでにインストール済みかチェックしてみましょう！

---

## 🔍 インストール済みか確認する方法

PowerShell を開いて、以下のコマンドを実行してください：

```powershell
# Rustの確認
rustc --version

# wasm-packの確認
wasm-pack --version

# Node.jsの確認
node --version
npm --version

# Pythonの確認
python --version
```

バージョン番号が表示されれば OK です！  
「command not found」や「認識されていません」と表示されたら、次のセクションでインストールしましょう。

---

## 📥 インストール手順

### 1. Rust のインストール（必須）

#### ステップ 1: インストーラーをダウンロード

1. ブラウザで [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install) を開く
2. 「rustup-init.exe」をダウンロード
3. ダウンロードしたファイルを実行

#### ステップ 2: インストール実行

1. 画面が表示されたら `1` を入力して Enter
2. インストールが完了するまで待つ（5-10 分）
3. 完了したら PowerShell を**再起動**

#### ステップ 3: 確認

```powershell
rustc --version
cargo --version
```

バージョンが表示されれば OK！

---

### 2. wasm-pack のインストール（必須）

#### 前提条件

Rust がインストールされていること（上記の手順 1 を完了）

#### インストール

```powershell
cargo install wasm-pack
```

- 時間がかかります（10-15 分）
- 「Compiling...」と表示されたら正常に進んでいます
- 「Installed...」と表示されたら完了

#### 確認

```powershell
wasm-pack --version
```

---

### 3. Node.js のインストール（必須）

#### ステップ 1: インストーラーをダウンロード

1. ブラウザで [https://nodejs.org/](https://nodejs.org/) を開く
2. **LTS 版**（推奨版）の緑色のボタンをクリック
3. ダウンロードしたファイルを実行

#### ステップ 2: インストール実行

1. インストーラーの指示に従う
2. すべてデフォルト設定で OK
3. 「Finish」をクリック

#### ステップ 3: 確認

PowerShell を**再起動**してから：

```powershell
node --version   # v18.0.0 以上
npm --version    # 9.0.0 以上
```

---

### 4. Python のインストール（オプション）

Windows 10/11 には Python が入っていることが多いです。

#### 確認

```powershell
python --version
```

#### もし入っていなければ

**方法 1: Microsoft Store から**

1. スタートメニューで「Microsoft Store」を開く
2. 「Python 3.12」を検索
3. インストール

**方法 2: 公式サイトから**

1. [https://www.python.org/downloads/](https://www.python.org/downloads/) を開く
2. 最新版をダウンロード
3. インストール時に **「Add Python to PATH」にチェック**

---

## 🚀 プロジェクトをビルドして実行

すべてのツールがインストールできたら、いよいよプロジェクトを動かします！

### ステップ 1: プロジェクトフォルダに移動

```powershell
cd text-encoder-decoder
```

### ステップ 2: 依存関係をインストール

```powershell
npm install
```

**何が起こるか**: `node_modules/` という フォルダが作られ、必要なツールがダウンロードされます。

### ステップ 3: ビルド

```powershell
.\build.ps1
```

**何が起こるか**:

1. Rust のコードが WebAssembly にコンパイル
2. TypeScript が JavaScript に変換

**時間**: 初回は 3-5 分かかります

**進行状況**:

- 「Step 1/2: Rust → WASM ビルド中...」
- 「Step 2/2: TypeScript → JavaScript トランスパイル中...」
- 「✅ すべてのビルドが完了しました！」

### ステップ 4: サーバーを起動

```powershell
.\serve.ps1
```

**何が起こるか**: ローカルサーバーが起動し、`http://localhost:8080` でアクセスできるようになります。

**サーバー起動中の表示**:

```
Serving HTTP on :: port 8080 ...
```

### ステップ 5: ブラウザで開く

ブラウザ（Chrome、Edge、Firefox など）で以下の URL を開きます：

```
http://localhost:8080
```

🎉 **完成です！** テキストエンコーダの画面が表示されるはずです。

---

## 🛑 サーバーを停止する方法

PowerShell で `Ctrl + C` を押すと、サーバーが停止します。

---

## 🐛 よくあるエラーと解決方法

### エラー 1: 「rustc は、内部コマンドまたは外部コマンド...として認識されていません」

**原因**: Rust がインストールされていない、または PATH が通っていない

**解決方法**:

1. Rust をインストール（上記の手順 1）
2. PowerShell を再起動
3. もう一度確認: `rustc --version`

### エラー 2: 「wasm-pack: command not found」

**原因**: wasm-pack がインストールされていない

**解決方法**:

```powershell
cargo install wasm-pack
```

### エラー 3: 「npm: command not found」

**原因**: Node.js がインストールされていない

**解決方法**:

1. Node.js をインストール（上記の手順 3）
2. PowerShell を再起動

### エラー 4: PowerShell スクリプトが実行できない

**エラーメッセージ**:

```
.\build.ps1 : このシステムではスクリプトの実行が無効になっているため...
```

**原因**: PowerShell の実行ポリシーが制限されている

**解決方法**:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

その後、もう一度 `.\build.ps1` を実行

### エラー 5: ページが真っ白

**原因**: ビルドが完了していない、またはファイルパスが間違っている

**確認事項**:

1. `pkg/` フォルダが存在するか
   ```powershell
   ls pkg/
   ```
2. `www/dist/` フォルダが存在するか
   ```powershell
   ls www/dist/
   ```
3. 両方とも存在しない場合は、もう一度ビルド
   ```powershell
   npm run build
   ```

### エラー 6: CORS エラー（ブラウザのコンソールに表示）

**原因**: ファイルを直接開いている（`file://`）

**解決方法**: 必ずローカルサーバー経由で開く

```powershell
.\serve.ps1
# その後、ブラウザで http://localhost:8080 を開く
```

---

## 💡 次のステップ

プロジェクトが動いたら、以下を試してみましょう：

1. **コードを読んでみる**

   - `www/types.ts` から読み始めるのがおすすめ
   - コメントが詳しく書いてあります

2. **テキストを変換してみる**

   - Base64、URL、HEX の 3 つの形式を試す
   - 可逆性テストも実行してみる

3. **開発者ツールを開いてみる**

   - ブラウザで `F12` を押す
   - コンソールにログが表示されます

4. **コードを少し変更してみる**
   - 例: ボタンの文字を変える
   - 例: 新しいメッセージを追加

---

## 📚 学習リソース

### 公式ドキュメント

- **Rust**: [https://www.rust-lang.org/ja/learn](https://www.rust-lang.org/ja/learn)
- **TypeScript**: [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
- **WebAssembly**: [https://rustwasm.github.io/docs/book/](https://rustwasm.github.io/docs/book/)

### 日本語の情報

- Rust の日本語コミュニティ
- TypeScript の日本語ハンドブック

---

## ❓ 質問がある場合

1. まずは「README.md」を読む
2. 「QUICKSTART_TS.md」も確認
3. それでも解決しない場合は、エラーメッセージをコピーして検索

---

**頑張ってください！🚀 このプロジェクトで多くのことを学べるはずです。**
