web.services = {
    user: {
        register: function (data, callback) {
            web.post('user/register', data, callback);
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
        finish: function (todoId, callback) {
            web.services.todo.edit({
                id: todoId,
                finish: Date.now()
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
            web.services.project.edit({
                id: id,
                finish: Date.now()
            }, callback);
        },
        unfinish: function (id, callback) {
            web.get('project/unfinish', {id: id}, callback);
        },
        remove: function (todoId, callback) {
            web.services.project.edit({
                id: todoId,
                removed: true
            }, callback);
        },
        unremove: function (todoId, callback) {
            web.services.project.edit({
                id: todoId,
                removed: false
            }, callback);
        }
    }
};

