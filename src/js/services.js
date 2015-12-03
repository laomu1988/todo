web = {
    config: {
        server: '/api/'
    }
};
var config = web.config;
web.ajax =
    web.services = {
        login: function (data, callback) {
            web.get('user/login', data, callback);
        },
        todo: {
            new: function (data, callback) {
                web.get('todo/new', data, callback);
            },
            list: function (data, callback) {
                web.get('todo/list', data, callback);
            },
            edit: function (data, callback) {
                web.get('todo/edit', data, callback);
            },
            finish: function (todoId, callback) {
                web.services.todo.edit({
                    id: todoId,
                    finishDate: Date.now()
                }, callback);
            },
            unfinish: function (todoId, callback) {
                web.get('todo/unfinish', {id: todoId}, callback);
            },
            remove: function (todoId, callback) {
                web.services.todo.edit({
                    id: todoId,
                    removed: true
                }, callback);
            },
            unremove: function (todoId, callback) {
                web.services.todo.edit({
                    id: todoId,
                    removed: false
                }, callback);
            },

        },
        project: {
            new: function (data, callback) {
                web.get('project/new', data, callback);
            },
            list: function (data, callback) {
                web.get('project/list', data, callback);
            }
        }
    };


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