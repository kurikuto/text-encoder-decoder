/**
 * 型定義ファイル（初学者向け）
 *
 * このファイルでは、アプリケーション全体で使う「型」を定義します。
 * TypeScriptの「型」とは、変数や関数が扱うデータの形を決めるものです。
 *
 * 📚 学習ポイント：
 * - interface: オブジェクトの形を定義
 * - type: 型に別名をつける
 * - readonly: 変更できないプロパティ
 */

// ============================================
// 🎯 WASM関数の戻り値の型
// ============================================

/**
 * エンコード・デコードの結果を表す型
 *
 * Rustの EncodeResult 構造体と対応しています。
 *
 * 使用例：
 * ```typescript
 * const result: EncodeResult = base64_encode("Hello");
 * if (result.success) {
 *   console.log(result.result); // エンコード結果
 * } else {
 *   console.error(result.error); // エラーメッセージ
 * }
 * ```
 */
export interface EncodeResult {
  /** 処理が成功したかどうか（true=成功, false=失敗） */
  readonly success: boolean;

  /** 変換結果の文字列（成功時のみ値が入る） */
  readonly result: string;

  /** エラーメッセージ（失敗時のみ値が入る） */
  readonly error: string;
}

// ============================================
// 🔤 エンコーディング形式の型
// ============================================

/**
 * サポートされているエンコーディング形式
 *
 * 3つの値のみを許可：
 * - 'base64': Base64エンコード
 * - 'url': URLエンコード
 * - 'hex': 16進数変換
 *
 * 📝 これを使うと、間違った値を代入できなくなります
 */
export type EncodingType = "base64" | "url" | "hex";

// ============================================
// 🖥️ DOM要素の型
// ============================================

/**
 * アプリで使用するDOM要素をまとめた型
 *
 * 📚 学習ポイント：
 * - HTMLTextAreaElement: テキストエリア(<textarea>)の型
 * - HTMLSelectElement: セレクトボックス(<select>)の型
 * - HTMLButtonElement: ボタン(<button>)の型
 * - HTMLDivElement: div要素(<div>)の型
 *
 * これにより、間違った要素にアクセスするとエラーになります
 */
export interface AppElements {
  readonly inputText: HTMLTextAreaElement; // 入力欄
  readonly encodingType: HTMLSelectElement; // 変換方式選択
  readonly encodeBtn: HTMLButtonElement; // エンコードボタン
  readonly decodeBtn: HTMLButtonElement; // デコードボタン
  readonly testBtn: HTMLButtonElement; // テストボタン
  readonly clearBtn: HTMLButtonElement; // クリアボタン
  readonly outputArea: HTMLDivElement; // 結果表示エリア
  readonly errorArea: HTMLDivElement; // エラー表示エリア
}

// ============================================
// 📊 ログレベル
// ============================================

/**
 * ログの重要度を表すレベル
 *
 * 📚 学習ポイント：
 * enumは「列挙型」と呼ばれ、決まった値のセットを定義します
 */
export enum LogLevel {
  DEBUG = "DEBUG", // デバッグ情報（開発中のみ）
  INFO = "INFO", // 通常の情報
  WARN = "WARN", // 警告
  ERROR = "ERROR", // エラー
}

// ============================================
// ⚙️ アプリケーション設定
// ============================================

/**
 * アプリの設定を表す型
 */
export interface AppConfig {
  readonly enableLogging: boolean; // ログを出力するか
  readonly logLevel: LogLevel; // ログレベル
  readonly defaultEncodingType: EncodingType; // デフォルトの変換方式
  readonly maxInputLength: number; // 入力文字数の上限
}

// ============================================
// 💡 TypeScriptを学ぶためのヒント
// ============================================

/**
 * 🎓 このファイルから学べること：
 *
 * 1. interface の使い方
 *    - オブジェクトの形（プロパティの名前と型）を定義
 *
 * 2. type の使い方
 *    - 既存の型に別名をつける
 *    - ユニオン型（'a' | 'b' | 'c'）で選択肢を制限
 *
 * 3. readonly の意味
 *    - 一度設定したら変更できないプロパティ
 *    - バグを防ぐために重要
 *
 * 4. enum の使い方
 *    - 関連する定数をグループ化
 *    - 間違った値の使用を防ぐ
 *
 * 5. JSDoc コメント
 *    - スラッシュとアスタリスクで書くコメントは、エディタで補完時に表示される
 *    - 使い方の説明を書くと便利
 */
