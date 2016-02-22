web.services = {
    user: {
        register: function (data, callback) {
            web.get('user/register', data, callback);
        },
        login: function (data, callback) {
            web.get('user/login', data, callback);
        },
        logout: function (data, callback) {
            web.setCookie('user', '');
            web.get('user/logout', data, callback);
        }
    },
    todo: {
        new: function (data, callback) {
            web.get('todo/new', data, callback);
        },
        get: function (todoId, callback) {
            web.get('todo/get', {id: todoId}, callback);
        },
        list: function (data, callback) {
            web.get('todo/list', data, callback);
        },
        edit: function (data, callback) {
            web.get('todo/edit', data, callback);
        },
        finish: function (id, callback) {
            web.get('todo/finish', {id: id}, callback);
        },
        unfinish: function (id, callback) {
            web.get('todo/unfinish', {id: id}, callback);
        },
        remove: function (id, callback) {
            web.get('todo/remove', {id: id}, callback);
        },
        unremove: function (id, callback) {
            web.get('todo/unremove', {id: id}, callback);
        }
    },
    project: {
        new: function (data, callback) {
            web.get('project/new', data, callback);
        },
        get: function (id, callback) {
            web.get('project/get', {id: id}, callback);
        },
        list: function (data, callback) {
            web.get('project/list', data, callback);
        },
        edit: function (data, callback) {
            web.get('project/edit', data, callback);
        },
        finish: function (id, callback) {
            web.get('project/finish', {id: id}, callback);
        },
        unfinish: function (id, callback) {
            web.get('project/unfinish', {id: id}, callback);
        },
        remove: function (id, callback) {
            web.get('project/remove', {id: id}, callback);
        },
        unremove: function (id, callback) {
            web.get('project/unremove', {id: id}, callback);
        }
    }
};

