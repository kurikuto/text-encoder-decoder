/**
 * Webテキストエンコーダ・デコーダ（TypeScript版 - 初学者向け）
 *
 * 📚 このファイルで学べること：
 * 1. TypeScriptでWASMモジュールをインポートする方法
 * 2. 型を使って安全にDOM操作する方法
 * 3. エラーハンドリングのベストプラクティス
 * 4. async/await を使った非同期処理
 *
 * @version 0.1.0
 */

// ============================================
// 📦 インポート（必要なモジュールを読み込む）
// ============================================

// 型定義ファイルから型をインポート
import type {
  EncodeResult, // WASM関数の戻り値の型
  EncodingType, // 'base64' | 'url' | 'hex'
  AppElements, // DOM要素の型
  AppConfig, // アプリ設定の型
} from "./types.js";

// LogLevel をインポート（型だけでなく実際の値も使う）
import { LogLevel } from "./types.js";

// WASMモジュールのインポート
// 📝 init はWASMを初期化する関数
// 📝 他の関数はRustで実装したエンコード/デコード関数
import init, {
  base64_encode,
  base64_decode,
  url_encode,
  url_decode,
  hex_encode,
  hex_decode,
  test_base64_roundtrip,
} from "../pkg/text_encoder_decoder.js";

// ============================================
// ⚙️ アプリケーション設定
// ============================================

/**
 * アプリの設定
 *
 * 📚 学習ポイント：
 * - as const をつけると、値が変更できなくなります
 * - 1_000_000 は 1000000 と同じ（アンダースコアは読みやすさのため）
 */
const CONFIG: AppConfig = {
  enableLogging: true, // ログを出力する
  logLevel: LogLevel.INFO, // INFOレベル以上を出力
  defaultEncodingType: "base64", // デフォルトはBase64
  maxInputLength: 1_000_000, // 最大100万文字
} as const;

// ============================================
// 🖥️ DOM要素の参照
// ============================================

/**
 * DOM要素への参照を保持する変数
 *
 * 📚 学習ポイント：
 * - let で宣言（初期化関数で値を設定するため）
 * - AppElements 型を指定（どんな要素が入るか明確に）
 */
let elements: AppElements;

// ============================================
// 📊 ログ出力関数
// ============================================

/**
 * コンソールにログを出力する
 *
 * @param level - ログレベル（DEBUG, INFO, WARN, ERROR）
 * @param message - ログメッセージ
 * @param data - 追加データ（オプション）
 *
 * 📚 学習ポイント：
 * - 関数の引数に型を指定
 * - data?: unknown の ? は「省略可能」という意味
 */
function log(level: LogLevel, message: string, data?: unknown): void {
  // ログが無効なら何もしない
  if (!CONFIG.enableLogging) return;

  // タイムスタンプを作成
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;

  // レベルに応じてコンソール出力
  switch (level) {
    case LogLevel.DEBUG:
      console.debug(prefix, message, data ?? "");
      break;
    case LogLevel.INFO:
      console.log(prefix, message, data ?? "");
      break;
    case LogLevel.WARN:
      console.warn(prefix, message, data ?? "");
      break;
    case LogLevel.ERROR:
      console.error(prefix, message, data ?? "");
      break;
  }
}

// ============================================
// 🔍 DOM要素を安全に取得する関数
// ============================================

/**
 * IDで要素を取得し、型を確認する
 *
 * @param id - 要素のID
 * @param type - 期待される要素の型（例: HTMLButtonElement）
 * @returns 型付けされたDOM要素
 *
 * 📚 学習ポイント：
 * - ジェネリクス <T extends HTMLElement> で型を柔軟に指定
 * - new () => T は「この型のインスタンスを作るコンストラクタ」を意味
 * - instanceof で実際の型をチェック
 * - throw でエラーを投げる
 */
function getElementByIdSafe<T extends HTMLElement>(
  id: string,
  type: new () => T
): T {
  // 要素を取得
  const element = document.getElementById(id);

  // 要素が見つからない場合
  if (!element) {
    throw new Error(`要素が見つかりません: ${id}`);
  }

  // 要素の型が期待と違う場合
  if (!(element instanceof type)) {
    throw new Error(`要素の型が正しくありません: ${id}（期待: ${type.name}）`);
  }

  // 型チェックを通過したので、安全に返す
  return element;
}

// ============================================
// 🎨 UI表示関数
// ============================================

/**
 * 出力エリアに結果を表示
 *
 * @param text - 表示するテキスト
 * @param isSuccess - 成功かどうか（デフォルト: true）
 */
function displayOutput(text: string, isSuccess = true): void {
  // XSS対策: HTMLとして解釈されないように textContent を使う
  elements.outputArea.textContent = text;

  // 成功時はスタイルを変更
  if (isSuccess) {
    elements.outputArea.classList.add("success");
    elements.outputArea.classList.remove("error");
  } else {
    elements.outputArea.classList.remove("success");
  }

  // エラーエリアを非表示
  elements.errorArea.style.display = "none";

  log(LogLevel.INFO, "結果を表示", { length: text.length, isSuccess });
}

/**
 * エラーメッセージを表示
 *
 * @param message - エラーメッセージ
 */
function displayError(message: string): void {
  elements.errorArea.textContent = message;
  elements.errorArea.style.display = "block";

  // 出力エリアをクリア
  elements.outputArea.innerHTML =
    '<p class="placeholder">エラーが発生しました</p>';
  elements.outputArea.classList.remove("success");

  log(LogLevel.ERROR, message);
}

// ============================================
// ✅ バリデーション関数
// ============================================

/**
 * 入力値をチェックする
 *
 * @returns バリデーション結果（true=OK, false=NG）
 */
function validateInput(): boolean {
  const text = elements.inputText.value.trim();

  // 空文字チェック
  if (text === "") {
    displayError("テキストを入力してください");
    return false;
  }

  // 文字数チェック
  if (text.length > CONFIG.maxInputLength) {
    displayError(
      `入力が長すぎます（最大 ${CONFIG.maxInputLength.toLocaleString()} 文字）`
    );
    return false;
  }

  return true;
}

// ============================================
// 🔄 エンコード・デコード実行関数
// ============================================

/**
 * エンコード処理を実行
 *
 * @param input - 入力文字列
 * @param type - エンコーディング形式
 * @returns 処理結果
 *
 * 📚 学習ポイント：
 * - switch 文で処理を分岐
 * - never 型で「すべてのケースを処理した」ことを保証
 */
function executeEncode(input: string, type: EncodingType): EncodeResult {
  log(LogLevel.DEBUG, "エンコード実行", { type, inputLength: input.length });

  switch (type) {
    case "base64":
      return base64_encode(input);
    case "url":
      return url_encode(input);
    case "hex":
      return hex_encode(input);
    default:
      // 📝 never型: ここに到達することはない（すべてのケースを処理済み）
      // もし新しい EncodingType が追加されると、ここでコンパイルエラーになる
      const _exhaustive: never = type;
      throw new Error(`不明なエンコード方式: ${_exhaustive}`);
  }
}

/**
 * デコード処理を実行
 *
 * @param input - 入力文字列
 * @param type - エンコーディング形式
 * @returns 処理結果
 */
function executeDecode(input: string, type: EncodingType): EncodeResult {
  log(LogLevel.DEBUG, "デコード実行", { type, inputLength: input.length });

  switch (type) {
    case "base64":
      return base64_decode(input);
    case "url":
      return url_decode(input);
    case "hex":
      return hex_decode(input);
    default:
      const _exhaustive: never = type;
      throw new Error(`不明なデコード方式: ${_exhaustive}`);
  }
}

// ============================================
// 🎮 イベントハンドラ
// ============================================

/**
 * エンコードボタンがクリックされた時の処理
 */
function handleEncode(): void {
  // バリデーションチェック
  if (!validateInput()) return;

  const input = elements.inputText.value;
  // 📝 as EncodingType で型をキャスト（HTMLSelectElement.value は string 型）
  const type = elements.encodingType.value as EncodingType;

  try {
    // エンコード実行
    const result = executeEncode(input, type);

    if (result.success) {
      // 成功時
      displayOutput(result.result, true);
      log(LogLevel.INFO, `エンコード成功 [${type}]`, {
        inputLength: input.length,
        outputLength: result.result.length,
      });
    } else {
      // 失敗時
      displayError(result.error);
    }
  } catch (error) {
    // 予期しないエラー
    const errorMessage = error instanceof Error ? error.message : String(error);
    displayError(`予期しないエラー: ${errorMessage}`);
  }
}

/**
 * デコードボタンがクリックされた時の処理
 */
function handleDecode(): void {
  if (!validateInput()) return;

  const input = elements.inputText.value;
  const type = elements.encodingType.value as EncodingType;

  try {
    const result = executeDecode(input, type);

    if (result.success) {
      displayOutput(result.result, true);
      log(LogLevel.INFO, `デコード成功 [${type}]`);
    } else {
      displayError(result.error);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    displayError(`予期しないエラー: ${errorMessage}`);
  }
}

/**
 * 可逆性テストボタンがクリックされた時の処理
 */
function handleTest(): void {
  if (!validateInput()) return;

  const input = elements.inputText.value;

  try {
    const result = test_base64_roundtrip(input);

    if (result.success) {
      displayOutput(result.result, true);
      log(LogLevel.INFO, "可逆性テスト成功");
    } else {
      displayError(result.error);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    displayError(`予期しないエラー: ${errorMessage}`);
  }
}

/**
 * クリアボタンがクリックされた時の処理
 */
function handleClear(): void {
  elements.inputText.value = "";
  elements.outputArea.innerHTML =
    '<p class="placeholder">変換結果がここに表示されます</p>';
  elements.outputArea.classList.remove("success");
  elements.errorArea.style.display = "none";

  log(LogLevel.INFO, "クリアしました");
}

// ============================================
// 🔧 イベントリスナー設定
// ============================================

/**
 * すべてのイベントリスナーを設定
 */
function setupEventListeners(): void {
  log(LogLevel.DEBUG, "イベントリスナーを設定中...");

  // ボタンクリックイベント
  elements.encodeBtn.addEventListener("click", handleEncode);
  elements.decodeBtn.addEventListener("click", handleDecode);
  elements.testBtn.addEventListener("click", handleTest);
  elements.clearBtn.addEventListener("click", handleClear);

  // キーボードショートカット（Ctrl+Enter でエンコード）
  elements.inputText.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      handleEncode();
    }
  });

  log(LogLevel.INFO, "イベントリスナーの設定完了");
}

// ============================================
// 🚀 アプリケーション初期化
// ============================================

/**
 * アプリケーションを初期化する
 *
 * 📚 学習ポイント：
 * - async function は非同期関数（await が使える）
 * - await で非同期処理の完了を待つ
 * - try-catch でエラーをキャッチ
 */
async function initApp(): Promise<void> {
  try {
    log(LogLevel.INFO, "🚀 アプリケーション初期化開始...");

    // Step 1: WASMモジュールの初期化
    log(LogLevel.DEBUG, "WASMモジュールを読み込み中...");
    await init(); // 📝 await で初期化完了を待つ
    log(LogLevel.INFO, "✅ WASMモジュールの初期化完了");

    // Step 2: DOM要素の取得
    elements = {
      inputText: getElementByIdSafe("inputText", HTMLTextAreaElement),
      encodingType: getElementByIdSafe("encodingType", HTMLSelectElement),
      encodeBtn: getElementByIdSafe("encodeBtn", HTMLButtonElement),
      decodeBtn: getElementByIdSafe("decodeBtn", HTMLButtonElement),
      testBtn: getElementByIdSafe("testBtn", HTMLButtonElement),
      clearBtn: getElementByIdSafe("clearBtn", HTMLButtonElement),
      outputArea: getElementByIdSafe("outputArea", HTMLDivElement),
      errorArea: getElementByIdSafe("errorArea", HTMLDivElement),
    };
    log(LogLevel.INFO, "✅ DOM要素の取得完了");

    // Step 3: イベントリスナーの設定
    setupEventListeners();

    // Step 4: 初期状態の設定
    elements.encodingType.value = CONFIG.defaultEncodingType;
    elements.inputText.placeholder =
      "例: Hello, Rust WASM! 🦀\nまたは: こんにちは、世界！\n\nヒント: Ctrl+Enter でエンコード実行";

    log(LogLevel.INFO, "🎉 アプリケーションの準備完了！");
    console.log("💡 ヒント: window.encoderApp でコンソールから操作できます");
  } catch (error) {
    // エラーが発生した場合
    log(LogLevel.ERROR, "❌ アプリケーション初期化失敗", error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    alert(`初期化エラー: ${errorMessage}\n\nページをリロードしてください。`);

    throw error; // エラーを再スロー
  }
}

// ============================================
// 🌐 グローバルAPIの公開（デバッグ用）
// ============================================

/**
 * ブラウザのコンソールから操作できるようにする
 *
 * 📚 学習ポイント：
 * - declare global で window オブジェクトに型を追加
 * - interface Window で window.encoderApp の型を定義
 */
declare global {
  interface Window {
    encoderApp: {
      encode: typeof handleEncode;
      decode: typeof handleDecode;
      test: typeof handleTest;
      clear: typeof handleClear;
      config: typeof CONFIG;
    };
  }
}

// デバッグ用APIをグローバルに公開
window.encoderApp = {
  encode: handleEncode,
  decode: handleDecode,
  test: handleTest,
  clear: handleClear,
  config: CONFIG,
};

// ============================================
// 🎬 アプリケーション起動
// ============================================

// ページ読み込み時にアプリを起動
initApp().catch((error) => {
  console.error("💥 致命的なエラー:", error);
});

// ============================================
// 🎓 TypeScript学習のまとめ
// ============================================

/**
 * このファイルで使用したTypeScriptの機能：
 *
 * 1. 型注釈（Type Annotations）
 *    - function log(level: LogLevel, message: string): void
 *    - 変数、関数の引数、戻り値に型を指定
 *
 * 2. インターフェース（Interface）
 *    - AppElements, EncodeResult など
 *    - オブジェクトの形を定義
 *
 * 3. 型エイリアス（Type Alias）
 *    - type EncodingType = 'base64' | 'url' | 'hex'
 *    - 複雑な型に名前をつける
 *
 * 4. ジェネリクス（Generics）
 *    - <T extends HTMLElement>
 *    - 型を柔軟に扱う
 *
 * 5. ユニオン型（Union Types）
 *    - string | number など
 *    - 複数の型のいずれか
 *
 * 6. オプショナル（Optional）
 *    - data?: unknown
 *    - 省略可能なパラメータ
 *
 * 7. Null合体演算子（Nullish Coalescing）
 *    - data ?? ''
 *    - null/undefined の場合デフォルト値
 *
 * 8. never型
 *    - 到達しないコードの型
 *    - 網羅性チェックに使用
 *
 * 9. 型アサーション（Type Assertion）
 *    - value as EncodingType
 *    - 型を手動で指定
 *
 * 10. async/await
 *     - 非同期処理を同期的に書く
 */
