// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
var gl = require('cloud/gl.js');
// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();
// App 全局配置
app.use(express.bodyParser());    // 读取请求 body 的中间件
app.use(express.cookieParser());
app.use(express.cookieSession({secret: 'todo2015', name: 'todo', cookie: {maxAge: 60 * 60 * 1000}})); // session


var routes = require('cloud/routes.js');

// 每次处理程序之前，都增加转换
function before(req, res, next) {
    req.data = req.method == 'GET' ? req.query : req.body;
    delete req.data.__proto__;
    console.log(req.data);
    console.log('before', JSON.stringify(req.data));
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
app.use(express.static(__dirname + '/../public'));
app.use(function (req, res) {
    gl.error(res, 404);
});
app.listen();