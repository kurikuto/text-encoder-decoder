/**
 * Webテキストエンコーダ・デコーダ
 * JavaScript <-> Rust WASM 連携部分
 * 
 * このファイルでは以下を実装：
 * 1. WASMモジュールの読み込み
 * 2. UI要素との接続
 * 3. イベントハンドラの設定
 * 4. エラーハンドリング
 */

// WASMモジュールの動的インポート
// Note: ビルド後に生成される pkg フォルダから読み込む
import init, {
    base64_encode,
    base64_decode,
    url_encode,
    url_decode,
    hex_encode,
    hex_decode,
    test_base64_roundtrip
} from '../pkg/text_encoder_decoder.js';

// DOM要素の取得
const inputText = document.getElementById('inputText');
const encodingType = document.getElementById('encodingType');
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');
const testBtn = document.getElementById('testBtn');
const clearBtn = document.getElementById('clearBtn');
const outputArea = document.getElementById('outputArea');
const errorArea = document.getElementById('errorArea');

/**
 * 出力エリアに結果を表示
 * @param {string} text - 表示するテキスト
 * @param {boolean} isSuccess - 成功かどうか
 */
function displayOutput(text, isSuccess = true) {
    outputArea.innerHTML = '';
    outputArea.textContent = text;
    
    if (isSuccess) {
        outputArea.classList.add('success');
        outputArea.classList.remove('error');
    } else {
        outputArea.classList.remove('success');
    }
    
    // エラーエリアを非表示
    errorArea.style.display = 'none';
}

/**
 * エラーメッセージを表示
 * @param {string} message - エラーメッセージ
 */
function displayError(message) {
    errorArea.textContent = message;
    errorArea.style.display = 'block';
    
    // 出力エリアをクリア
    outputArea.innerHTML = '<p class="placeholder">エラーが発生しました</p>';
    outputArea.classList.remove('success');
}

/**
 * 入力値のバリデーション
 * @returns {boolean} - バリデーション結果
 */
function validateInput() {
    const text = inputText.value.trim();
    
    if (text === '') {
        displayError('テキストを入力してください');
        return false;
    }
    
    return true;
}

/**
 * エンコード処理
 */
function handleEncode() {
    if (!validateInput()) return;
    
    const input = inputText.value;
    const type = encodingType.value;
    
    try {
        let result;
        
        switch (type) {
            case 'base64':
                result = base64_encode(input);
                break;
            case 'url':
                result = url_encode(input);
                break;
            case 'hex':
                result = hex_encode(input);
                break;
            default:
                displayError('不明なエンコード方式です');
                return;
        }
        
        if (result.success) {
            displayOutput(result.result, true);
            console.log(`✓ エンコード成功 [${type}]:`, result.result);
        } else {
            displayError(result.error);
            console.error(`✗ エンコード失敗 [${type}]:`, result.error);
        }
    } catch (error) {
        displayError(`予期しないエラー: ${error.message}`);
        console.error('エンコードエラー:', error);
    }
}

/**
 * デコード処理
 */
function handleDecode() {
    if (!validateInput()) return;
    
    const input = inputText.value;
    const type = encodingType.value;
    
    try {
        let result;
        
        switch (type) {
            case 'base64':
                result = base64_decode(input);
                break;
            case 'url':
                result = url_decode(input);
                break;
            case 'hex':
                result = hex_decode(input);
                break;
            default:
                displayError('不明なデコード方式です');
                return;
        }
        
        if (result.success) {
            displayOutput(result.result, true);
            console.log(`✓ デコード成功 [${type}]:`, result.result);
        } else {
            displayError(result.error);
            console.error(`✗ デコード失敗 [${type}]:`, result.error);
        }
    } catch (error) {
        displayError(`予期しないエラー: ${error.message}`);
        console.error('デコードエラー:', error);
    }
}

/**
 * 可逆性テスト（Base64専用）
 */
function handleTest() {
    if (!validateInput()) return;
    
    const input = inputText.value;
    
    try {
        const result = test_base64_roundtrip(input);
        
        if (result.success) {
            displayOutput(result.result, true);
            console.log('✓ 可逆性テスト成功');
        } else {
            displayError(result.error);
            console.error('✗ 可逆性テスト失敗:', result.error);
        }
    } catch (error) {
        displayError(`予期しないエラー: ${error.message}`);
        console.error('テストエラー:', error);
    }
}

/**
 * クリア処理
 */
function handleClear() {
    inputText.value = '';
    outputArea.innerHTML = '<p class="placeholder">変換結果がここに表示されます</p>';
    outputArea.classList.remove('success');
    errorArea.style.display = 'none';
    console.log('🗑️ クリアしました');
}

/**
 * イベントリスナーの設定
 */
function setupEventListeners() {
    encodeBtn.addEventListener('click', handleEncode);
    decodeBtn.addEventListener('click', handleDecode);
    testBtn.addEventListener('click', handleTest);
    clearBtn.addEventListener('click', handleClear);
    
    // Enterキーでエンコード実行
    inputText.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            handleEncode();
        }
    });
    
    console.log('✓ イベントリスナーを設定しました');
}

/**
 * アプリケーション初期化
 */
async function initApp() {
    try {
        console.log('🚀 アプリケーション初期化中...');
        
        // WASMモジュールの初期化
        await init();
        
        console.log('✓ WASMモジュールの初期化完了');
        
        // イベントリスナーの設定
        setupEventListeners();
        
        console.log('✓ アプリケーションの準備完了！');
        
        // サンプルテキストを表示（学習用）
        inputText.placeholder = '例: Hello, Rust WASM! 🦀\nまたは: こんにちは、世界！';
        
    } catch (error) {
        console.error('❌ 初期化エラー:', error);
        displayError(`アプリケーションの初期化に失敗しました: ${error.message}`);
    }
}

// アプリケーション起動
initApp();

// グローバルスコープにエクスポート（デバッグ用）
window.encoderApp = {
    encode: handleEncode,
    decode: handleDecode,
    test: handleTest,
    clear: handleClear
};

console.log('💡 ヒント: window.encoderApp でコンソールから操作できます');
