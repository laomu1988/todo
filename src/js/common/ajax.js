web.ajax = function (type, page, data, callback) {
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
        type: type,
        dataType: 'json',
        success: function (result) {
            if (result) {
                result.ajax_data = {type: type, data: data, page: page};
            }
            web.config.onAjaxload && web.config.onAjaxload(result);
            callback(result);
        },
        error: function (err) {
            console.log(err);
            // todo: delete
            callback({
                ajax_data: {type: type, data: data, page: page},
                errno: 405,
                message: '系统错误，请稍候再试.',
                errmsg: '系统错误，请稍候再试'
            });
        }
    });
};

/**
 * 动态请求以及一些默认处理
 * */
web.get = function (page, data, callback) {
    web.ajax('get', page, data, callback);
};
web.post = function (page, data, callback) {
    web.ajax('post', page, data, callback);
};