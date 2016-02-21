// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
var express = require('express');
var gl = require('./cloud/gl.js');
var AV = require('leanengine');
global.AV = gl.AV = AV;
var APP_ID = process.env.LC_APP_ID;
var APP_KEY = process.env.LC_APP_KEY;
var MASTER_KEY = process.env.LC_APP_MASTER_KEY;

AV.initialize(APP_ID, APP_KEY, MASTER_KEY);


var session = require('cookie-session');
var bodyParser = require('body-parser');
var app = express();
// App 全局配置
app.use(bodyParser.json());    // 读取请求 get请求中的json
app.use(bodyParser.urlencoded({ extended: false }));// post form 的中间件
app.use(AV.Cloud.CookieSession({secret: 'my secret', maxAge: 3600000, fetchUser: true}));


app.set('trust proxy', 1) // trust first proxy
app.use(session({secret: 'todo2015', name: 'todo', keys: ['key1', 'key2'], cookie: {maxAge: 60 * 60 * 1000 * 24 * 7}})); // session


var routes = require('./cloud/routes.js');

// 每次处理程序之前，都增加转换
function before(req, res, next) {
    req.data = req.method == 'GET' ? req.query : req.body;
    delete req.data.__proto__;
    next();
}
// 路由处理部分
for (var i = 0; i < routes.length; i++) {
    (function (route) {
        var method = route.method || 'all';
        var arr = [route.url];
        arr.push(before);
        if (route.handles && route.handles.concat) {
            arr = arr.concat(route.handles);
        }
        app[method].apply(app, arr);
    })(routes[i]);
}
app.use(express.static('public'));
app.use(function (req, res) {
    gl.error(res, 404);
});
var PORT = parseInt(process.env.LC_APP_PORT || 3000);
app.listen(PORT, function () {
    console.log('Node app is running, port:', PORT);
});