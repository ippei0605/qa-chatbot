/**
 * Q&A Chatbot: コンテキスト
 *
 * @module utils/context
 * @author Ippei SUZUKI
 */

'use strict';

// モジュールを読込む。
const
    vcapServices = require('vcap_services');

// ユーザー定義の環境変数からデータベース名を取得する。(未設定 = answer)
const DB_NAME =  process.env.DB_NAME || 'answer';

// ユーザー定義の環境変数から Watson Natural Language Classifier ID を取得する。(未設定 = 空文字)
const CLASSIFIER_ID = process.env.CLASSIFIER_ID || '';

// ユーザー定義の環境変数から Watson Speech to Text CUSTOMIZATION_ID を取得する。(未設定 = 空文字)
const CUSTOMIZATION_ID = process.env.CUSTOMIZATION_ID || '';

/**
 * コンテキスト
 * @property {string} CLASSIFIER_ID Watson Natural Language Classifier ID
 * @property {string} CUSTOMIZATION_ID Watson Speech to Text カスタムモデル ID
 * @property {string} DB_NAME データベース名
 * @property {object} cloudantCreds Cloudant NoSQL DB サービス資格情報
 * @property {object} nlcCreds Watson Natural Language Classifier サービス資格情報
 * @property {object} sttCreds Watson Speech to Text サービス資格情報
 * @property {object} ttsCreds Watson Text to Speech サービス資格情報
 *
 * @type {{CLASSIFIER_ID: string, CUSTOMIZATION_ID: string, DB_NAME: string, cloudantCreds: Object, nlcCreds: Object, sttCreds: Object, ttsCreds: Object}}
 */
module.exports = {
    "CLASSIFIER_ID": CLASSIFIER_ID,
    "CUSTOMIZATION_ID": CUSTOMIZATION_ID,
    "DB_NAME": DB_NAME,
    "cloudantCreds": vcapServices.getCredentials('cloudantNoSQLDB'),
    "nlcCreds": vcapServices.getCredentials('natural_language_classifier'),
    "sttCreds": vcapServices.getCredentials('speech_to_text'),
    "ttsCreds": vcapServices.getCredentials('text_to_speech'),
};
