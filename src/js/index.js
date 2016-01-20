$(function () {
    function route() {
        var method = web._hashs.method;
        switch (method) {
            case 'project':
                web.services.todo.list({project: web._hashs.project}, function (result) {
                    if (result && result.code == 0) {
                        riot.mount('todo_list', result.data);
                    }
                });
                break;
            case 'finished':
                web.services.todo.list({finished: true}, function (result) {
                    if (result && result.code == 0) {
                        riot.mount('todo_list', result.data);
                    }
                });
                break;
            case 'removed':
                web.services.todo.list({removed: true}, function (result) {
                    if (result && result.code == 0) {
                        riot.mount('todo_list', result.data);
                    }
                });
                break;
            case 'todo':
            default:
                web.services.todo.list(function (result) {
                    if (result && result.code == 0) {
                        riot.mount('todo_list', result.data);
                    }
                });
                break;
        }
    }

    riot.route(route);
    route();
});
