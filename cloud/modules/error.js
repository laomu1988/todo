var errors = [
    {code: 401, sign: 'need_login', message: '需要登录！'},
    {code: 402, sign: 'need_right', message: '没有权限查看该页面！'},
    {code: 404, sign: 'not_found', message: '没有找到该页面！'},
    {code: 500, sign: 'error', message: '未知错误！'},
];
var codes = {};
for (var i = 0; i < errors.length; i++) {
    var error = errors[i];
    codes[error.code] = error;
    codes[error.sign] = error;
}

gl.error = function (res, sign) {
    var error = codes[sign];
    if (error) {
        res.json({code: error.code, message: error.message});
    } else {
        console.log("未知错误：" + sign);
        res.json({code: 500, error: '未知错误！'});
    }
};
/**
 * 生成类似下面结构的错误函数
 * gl.error.need_login = function (res) {
    res.json({code: 401, msg: '需要登录！'});
}
 *
 * */
function errorHandle(error) {
    gl.error[error.sign] = function (res) {
        res.json({code: error.code, message: error.message});
    }
}
for (var i = 0; i < errors.length; i++) {
    errorHandle(errors[i]);
}