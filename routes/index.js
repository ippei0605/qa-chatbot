/**
 * Q&A Chatbot: ルーティング
 *
 * | url             | パラメータ                                      |処理            　    |
 * | :-------------  | : -------------------------------------------  |:------------------  |
 * | /               |                                                | Q&A 画面を表示する。  |
 * | /ask            | text テキスト, now 時刻 (yyyy年M月d日 h時m分s秒)  | Watson に尋ねる。    |
 * | /class-name     | text テキスト, now 時刻 (yyyy年M月d日 h時m分s秒)  | クラス名を問合せる。  |
 *
 * @module routes/index
 * @author Ippei SUZUKI
 */

'use strict';

// モジュールを読込む。
const
    express = require('express'),
    QaModel = require('watson-nlc-qa'),
    context = require('../utils/context');

// ルーターを作成する。
const router = express.Router();

// Q&A モデルを作成する。
const qa = new QaModel(context.cloudantCreds, context.DB_NAME, context.nlcCreds);

// こんにちはを変換する。
const replaceHello = (text, replaceText) => {
    return text.replace(/こんにちは/g, replaceText);
};

// 条件により回答を確定する。
const editAnswer = (value, now) => {
    switch (value.class_name) {
        case 'general_hello':
            let regexp = /(\d+)年(\d+)月(\d+)日 (\d+)時(\d+)分(\d+)秒/;
            let hour = parseInt(regexp.exec(now)[4], 10);
            if (hour >= 17) {
                value.message = replaceHello(value.message, 'こんばんは');
            } else if (hour < 11 && hour >= 5) {
                value.message = replaceHello(value.message, 'おはようございます');
            } else if (hour < 5) {
                value.message = replaceHello(value.message, 'お疲れ様です');
            }
            break;

        default:
            break;
    }
    return value;
};

// Q&A 画面を表示する。
router.get('/', (req, res) => {
    qa.getAppSettings((value) => {
        res.render('index', {title: value.name});
    });
});

// Watson に尋ねる。
router.get('/ask', (req, res) => {
    qa.ask(req.query.text, (value) => {
        res.send(editAnswer(value, req.query.now));
    });
});

// クラス名を問合せる。
router.get('/class-name', (req, res) => {
    qa.askClassName(req.query.text, (value) => {
        res.send(editAnswer(value, req.query.now));
    });
});

module.exports = router;
