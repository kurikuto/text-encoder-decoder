// WASM向けのテキストエンコーダ・デコーダライブラリ
// 初学者向けに、各関数にコメントを付けて実装

use wasm_bindgen::prelude::*;
use base64::{Engine as _, engine::general_purpose};

/// JavaScriptのコンソールにログ出力するための設定
#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

/// 処理結果を返すための構造体
/// エラーが発生した場合は error フィールドにメッセージが入る
#[wasm_bindgen]
#[derive(Clone)]
pub struct EncodeResult {
    success: bool,
    result: String,
    error: String,
}

#[wasm_bindgen]
impl EncodeResult {
    /// 成功したかどうかを返す
    #[wasm_bindgen(getter)]
    pub fn success(&self) -> bool {
        self.success
    }

    /// 変換結果を返す
    #[wasm_bindgen(getter)]
    pub fn result(&self) -> String {
        self.result.clone()
    }

    /// エラーメッセージを返す
    #[wasm_bindgen(getter)]
    pub fn error(&self) -> String {
        self.error.clone()
    }
}

// ========================================
// Base64 エンコード・デコード
// ========================================

/// Base64エンコード
/// 
/// # 引数
/// * `input` - エンコードする文字列
/// 
/// # 戻り値
/// エンコード結果を含む EncodeResult
#[wasm_bindgen]
pub fn base64_encode(input: &str) -> EncodeResult {
    log(&format!("Base64エンコード開始: {} 文字", input.len()));
    
    let encoded = general_purpose::STANDARD.encode(input.as_bytes());
    
    EncodeResult {
        success: true,
        result: encoded,
        error: String::new(),
    }
}

/// Base64デコード
/// 
/// # 引数
/// * `input` - デコードするBase64文字列
/// 
/// # 戻り値
/// デコード結果を含む EncodeResult
#[wasm_bindgen]
pub fn base64_decode(input: &str) -> EncodeResult {
    log(&format!("Base64デコード開始: {} 文字", input.len()));
    
    match general_purpose::STANDARD.decode(input) {
        Ok(decoded_bytes) => {
            match String::from_utf8(decoded_bytes) {
                Ok(decoded_string) => EncodeResult {
                    success: true,
                    result: decoded_string,
                    error: String::new(),
                },
                Err(e) => EncodeResult {
                    success: false,
                    result: String::new(),
                    error: format!("UTF-8変換エラー: {}", e),
                },
            }
        }
        Err(e) => EncodeResult {
            success: false,
            result: String::new(),
            error: format!("Base64デコードエラー: {}", e),
        },
    }
}

// ========================================
// URLエンコード・デコード
// ========================================

/// URLエンコード
/// 
/// # 引数
/// * `input` - エンコードする文字列
/// 
/// # 戻り値
/// エンコード結果を含む EncodeResult
#[wasm_bindgen]
pub fn url_encode(input: &str) -> EncodeResult {
    log(&format!("URLエンコード開始: {} 文字", input.len()));
    
    let encoded = urlencoding::encode(input);
    
    EncodeResult {
        success: true,
        result: encoded.to_string(),
        error: String::new(),
    }
}

/// URLデコード
/// 
/// # 引数
/// * `input` - デコードするURL文字列
/// 
/// # 戻り値
/// デコード結果を含む EncodeResult
#[wasm_bindgen]
pub fn url_decode(input: &str) -> EncodeResult {
    log(&format!("URLデコード開始: {} 文字", input.len()));
    
    match urlencoding::decode(input) {
        Ok(decoded) => EncodeResult {
            success: true,
            result: decoded.to_string(),
            error: String::new(),
        },
        Err(e) => EncodeResult {
            success: false,
            result: String::new(),
            error: format!("URLデコードエラー: {}", e),
        },
    }
}

// ========================================
// HEX変換
// ========================================

/// HEXエンコード（文字列を16進数に変換）
/// 
/// # 引数
/// * `input` - エンコードする文字列
/// 
/// # 戻り値
/// エンコード結果を含む EncodeResult
#[wasm_bindgen]
pub fn hex_encode(input: &str) -> EncodeResult {
    log(&format!("HEXエンコード開始: {} 文字", input.len()));
    
    let encoded = hex::encode(input.as_bytes());
    
    EncodeResult {
        success: true,
        result: encoded,
        error: String::new(),
    }
}

/// HEXデコード（16進数を文字列に変換）
/// 
/// # 引数
/// * `input` - デコードする16進数文字列
/// 
/// # 戻り値
/// デコード結果を含む EncodeResult
#[wasm_bindgen]
pub fn hex_decode(input: &str) -> EncodeResult {
    log(&format!("HEXデコード開始: {} 文字", input.len()));
    
    match hex::decode(input) {
        Ok(decoded_bytes) => {
            match String::from_utf8(decoded_bytes) {
                Ok(decoded_string) => EncodeResult {
                    success: true,
                    result: decoded_string,
                    error: String::new(),
                },
                Err(e) => EncodeResult {
                    success: false,
                    result: String::new(),
                    error: format!("UTF-8変換エラー: {}", e),
                },
            }
        }
        Err(e) => EncodeResult {
            success: false,
            result: String::new(),
            error: format!("HEXデコードエラー: {}", e),
        },
    }
}

// ========================================
// 可逆性テスト（学習用のボーナス機能）
// ========================================

/// Base64のエンコード→デコード可逆性テスト
/// 
/// # 引数
/// * `input` - テストする文字列
/// 
/// # 戻り値
/// テスト結果を含む EncodeResult
#[wasm_bindgen]
pub fn test_base64_roundtrip(input: &str) -> EncodeResult {
    log("Base64可逆性テスト開始");
    
    // エンコード
    let encoded = general_purpose::STANDARD.encode(input.as_bytes());
    
    // デコード
    match general_purpose::STANDARD.decode(&encoded) {
        Ok(decoded_bytes) => {
            match String::from_utf8(decoded_bytes) {
                Ok(decoded_string) => {
                    if decoded_string == input {
                        EncodeResult {
                            success: true,
                            result: format!("✓ テスト成功！元の文字列と一致しました。\n元: {}\nエンコード: {}\nデコード: {}", 
                                          input, encoded, decoded_string),
                            error: String::new(),
                        }
                    } else {
                        EncodeResult {
                            success: false,
                            result: String::new(),
                            error: format!("✗ テスト失敗：元の文字列と一致しません。\n元: {}\nデコード後: {}", 
                                         input, decoded_string),
                        }
                    }
                }
                Err(e) => EncodeResult {
                    success: false,
                    result: String::new(),
                    error: format!("UTF-8変換エラー: {}", e),
                },
            }
        }
        Err(e) => EncodeResult {
            success: false,
            result: String::new(),
            error: format!("デコードエラー: {}", e),
        },
    }
}

// ========================================
// 初期化関数
// ========================================

/// WASMモジュールの初期化
/// パニック時のエラーメッセージをより見やすくする
#[wasm_bindgen(start)]
pub fn init() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
    
    log("🦀 Rust WASM テキストエンコーダが初期化されました！");
}

// ========================================
// テスト（Rust側でのユニットテスト）
// ========================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_base64_encode_decode() {
        let input = "Hello, Rust WASM!";
        let encoded = base64_encode(input);
        assert!(encoded.success);
        
        let decoded = base64_decode(&encoded.result);
        assert!(decoded.success);
        assert_eq!(decoded.result, input);
    }

    #[test]
    fn test_url_encode_decode() {
        let input = "こんにちは 世界";
        let encoded = url_encode(input);
        assert!(encoded.success);
        
        let decoded = url_decode(&encoded.result);
        assert!(decoded.success);
        assert_eq!(decoded.result, input);
    }

    #[test]
    fn test_hex_encode_decode() {
        let input = "Test123";
        let encoded = hex_encode(input);
        assert!(encoded.success);
        
        let decoded = hex_decode(&encoded.result);
        assert!(decoded.success);
        assert_eq!(decoded.result, input);
    }
}
