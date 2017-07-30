/**
 * @file Q&A Chatbot: アプリ
 *
 * <pre>
 * 起動方法:
 * ・package.json の scripts.start で実行するように設定する。 (node app.js)
 *
 * 処理記述:
 * ・アプリを作成して、リクエストを受付ける。
 * ・ルートは routes/index.js に示す。
 * </pre>
 *
 * @author Ippei SUZUKI
 */

'use strict';

// モジュールを読込む。
const
    bodyParser = require('body-parser'),
    cfenv = require('cfenv'),
    express = require('express'),
    logger = require('morgan'),
    path = require('path'),
    favicon = require('serve-favicon');

// アプリケーションを作成する。
const app = express();

// 環境変数を取得する。
const appEnv = cfenv.getAppEnv();

// ミドルウェアを設定する。
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(favicon(__dirname + '/public/favicon.ico'));

// ルートを設定する。
app.use('/', require('./routes'));
app.use('/watson-speech', require('./routes/watson-speech'));

// リクエトを受付ける。
app.listen(appEnv.port, () => {
    console.log('server starting on ' + appEnv.url);
});