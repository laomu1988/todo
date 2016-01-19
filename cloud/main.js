// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
var Data = require('cloud/gl.js');
// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var app = express();
// App 全局配置
app.use(express.bodyParser());    // 读取请求 body 的中间件
app.use(express.cookieParser());
app.use(express.cookieSession({secret: 'todo2015', name: 'todo', cookie: {maxAge: 60 * 60 * 1000}})); // session


var routes = [
    {url: '/api/user/signup', handles: [Data.user.new], method: 'all'},
    {url: '/api/user/login', handles: [Data.user.login]},
    {url: '/api/todo/new', handles: [Data.right.needLogin, Data.todo.new]},
    {url: '/api/todo/list', handles: [Data.right.needLogin, Data.todo.list]},
    {url: '/api/todo/edit', handles: [Data.right.needLogin, Data.todo.edit]},
    {url: '/api/todo/unfinish', handles: [Data.right.needLogin, Data.todo.unfinish]},
    {url: '/api/project/new', handles: [Data.right.needLogin, Data.project.new]},
    {url: '/api/project/list', handles: [Data.right.needLogin, Data.project.list]},
    {url: '/api/project/edit', handles: [Data.right.needLogin, Data.project.edit]}
];
function before(req, res, next) {
    req.data = req.method == 'GET' ? req.query : req.body;
    delete req.data.__proto__;
    console.log(req.data);
    console.log('before', JSON.stringify(req.data));
    next();
}
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
    res.json({
        code: 404,
        message: 'not found!'
    })
});
app.listen();