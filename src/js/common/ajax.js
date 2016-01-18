/**
 * 动态请求以及一些默认处理
 * */
web.get = function (page, data, callback) {
    if (typeof data === 'function') {
        callback = data;
        data = undefined;
    }
    if (!callback) {
        callback = function () {
        };
    }
    $.ajax({
        url: config.server + page,
        data: data,
        type: 'get',
        dataType: 'json',
        success: function (result) {
            web.config.onAjaxload && web.config.onAjaxload(result);
            callback(result);
        },
        error: function (err) {
            console.log(err);
            // todo: delete
            callback({
                errno: 405,
                message: '系统错误，请稍候再试.',
                errmsg: '系统错误，请稍候再试'
            });
        }
    });
};
web.post = function (page, data, callback) {
    if (typeof data === 'function') {
        callback = data;
        data = undefined;
    }
    if (!callback) {
        callback = function () {
        }
    }
    $.ajax({
        url: config.server + page,
        data: data,
        type: 'post',
        dataType: 'json',
        success: function (result) {
            web.config.onAjaxload && web.config.onAjaxload(result);
            callback(result);
        },
        error: function (err) {
            console.log(err);
            callback({
                errno: 405,
                message: '系统错误，请稍候再试.',
                errmsg: '系统错误，请稍候再试'
            });
        }
    });
};