from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import json
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

app = Flask(__name__)
CORS(app)

# OpenAI API 키
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

# 지원하는 언어 코드
SUPPORTED_LANGUAGES = {
    'ko': '한국어',
    'en': 'English',
    'zh': '中文',
    'ja': '日本語',
    'vi': 'Tiếng Việt',
    'th': 'ไทย'
}

@app.route('/')
def home():
    return jsonify({
        'message': 'QR Order Translation Service',
        'supported_languages': SUPPORTED_LANGUAGES
    })

@app.route('/api/translate', methods=['POST'])
def translate():
    data = request.json
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    text = data.get('text')
    source_lang = data.get('source_lang', 'ko')
    target_lang = data.get('target_lang', 'en')
    
    if not text:
        return jsonify({'error': 'No text provided'}), 400
    
    if target_lang not in SUPPORTED_LANGUAGES:
        return jsonify({'error': f'Unsupported target language: {target_lang}'}), 400

    # ChatGPT API를 통한 번역
    try:
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {OPENAI_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'system',
                        'content': f'You are a professional translator. Translate the following text from {SUPPORTED_LANGUAGES[source_lang]} to {SUPPORTED_LANGUAGES[target_lang]}. Provide only the translated text without explanations.'
                    },
                    {
                        'role': 'user',
                        'content': text
                    }
                ],
                'temperature': 0.3
            }
        )
        
        if response.status_code != 200:
            return jsonify({'error': f'API Error: {response.text}'}), 500
        
        translated_text = response.json()['choices'][0]['message']['content'].strip()
        
        return jsonify({
            'original': text,
            'translated': translated_text,
            'source_lang': source_lang,
            'target_lang': target_lang
        })
    
    except Exception as e:
        return jsonify({'error': f'Translation error: {str(e)}'}), 500

@app.route('/api/translate/batch', methods=['POST'])
def translate_batch():
    data = request.json
    
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    
    items = data.get('items', [])
    source_lang = data.get('source_lang', 'ko')
    target_lang = data.get('target_lang', 'en')
    
    if not items or not isinstance(items, list):
        return jsonify({'error': 'Invalid items format'}), 400
    
    if target_lang not in SUPPORTED_LANGUAGES:
        return jsonify({'error': f'Unsupported target language: {target_lang}'}), 400
    
    # 일괄 번역 처리
    try:
        # 번역 요청 텍스트 구성
        texts_to_translate = []
        for idx, item in enumerate(items):
            texts_to_translate.append(f"{idx}:{item.get('text', '')}")
        
        combined_text = "\n".join(texts_to_translate)
        
        # ChatGPT API를 통한 번역
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers={
                'Authorization': f'Bearer {OPENAI_API_KEY}',
                'Content-Type': 'application/json'
            },
            json={
                'model': 'gpt-3.5-turbo',
                'messages': [
                    {
                        'role': 'system',
                        'content': f'''
                        You are a professional translator. Translate the following list of texts from {SUPPORTED_LANGUAGES[source_lang]} to {SUPPORTED_LANGUAGES[target_lang]}.
                        The text will be in the format "ID:TEXT". Keep the ID and translate only the TEXT part.
                        Return the result in the same format "ID:TRANSLATED_TEXT".
                        '''
                    },
                    {
                        'role': 'user',
                        'content': combined_text
                    }
                ],
                'temperature': 0.3
            }
        )
        
        if response.status_code != 200:
            return jsonify({'error': f'API Error: {response.text}'}), 500
        
        translated_text = response.json()['choices'][0]['message']['content'].strip()
        
        # 번역 결과 파싱
        translated_lines = translated_text.split('\n')
        result = []
        
        for line in translated_lines:
            if ':' in line:
                try:
                    idx_str, text = line.split(':', 1)
                    idx = int(idx_str.strip())
                    if idx < len(items):
                        result.append({
                            'id': items[idx].get('id'),
                            'original': items[idx].get('text', ''),
                            'translated': text.strip()
                        })
                except (ValueError, IndexError):
                    continue
        
        return jsonify({
            'translations': result,
            'source_lang': source_lang,
            'target_lang': target_lang
        })
    
    except Exception as e:
        return jsonify({'error': f'Translation error: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port, debug=True)