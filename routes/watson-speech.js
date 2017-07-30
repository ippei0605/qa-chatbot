/**
 * Q&A Chatbot: Watson Speech のルーティング
 *
 * | url             | 処理            　                               |
 * | :-------------  | :---------------------------------------------  |
 * | /               | watsonSpeechContextを取得して、送信する。          |
 *
 * @module routes/watson-speech
 * @author Ippei SUZUKI
 * @see {@link https://www.ibm.com/watson/developercloud/doc/common/getting-started-tokens.html}
 */

'use strict';

// モジュールを読込む。
const
    express = require('express'),
    request = require('request'),
    context = require('../utils/context');

/**
 * Watson Speech to Text モデル名
 * @type {string}
 */
const STT_MODEL = 'ja-JP_BroadbandModel';

/**
 * Watson Speech to Text ボイス名
 * @type {string}
 */
const TTS_VOICE = "ja-JP_EmiVoice";

// ルーターを作成する。
const router = express.Router();

// トークンを取得する。
const token = (creds, callback) => {
    const get = {
        "method": "GET",
        "url": `https://stream.watsonplatform.net/authorization/api/v1/token?url=${creds.url}`,
        "auth": {
            "username": creds.username,
            "password": creds.password,
        },
        "headers": {
            "Content-Type": "application/json"
        },
        "json": true,
    };
    request(get, (error, response, body) => {
        if (200 === response.statusCode) {
            callback(body);
        } else {
            console.log('error:', body);
            callback({});
        }
    });
};

/**
 * @typedef {object} watsonSpeechContext
 * @property {object} stt Watson Speech to Text のコンテキスト
 * @property {string} stt.token トークン
 * @property {string} stt.model モデル
 * @property {string} stt.customization_id カスタムID
 * @property {object} tts Watson Text to Speech のコンテキスト
 * @property {string} tts.token トークン
 * @property {string} tts.voice ボイス
 */

router.get('/', (req, res) => {
    token(context.sttCreds, (sttResult) => {
        if (sttResult) {
            let sttValue = {
                "token": sttResult.token,
                "model": STT_MODEL
            };
            if (context.CUSTOMIZATION_ID) {
                sttValue.customization_id = context.CUSTOMIZATION_ID;
            }

            token(context.ttsCreds, (ttsResult) => {
                if (ttsResult) {
                    const watsonSpeechContext = {
                        "stt": sttValue,
                        "tts": {
                            "token": ttsResult.token,
                            "voice": TTS_VOICE
                        }
                    };
                    res.send(watsonSpeechContext);
                } else {
                    res.status(500).send('Error retrieving token');
                }
            });
        } else {
            res.status(500).send('Error retrieving token');
        }
    });
});

module.exports = router;