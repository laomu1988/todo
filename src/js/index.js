$(function () {
    var loading = $('.loading');

    function showList(template, result, msg) {
        msg = msg || '加载失败！';
        loading.hide();
        if (result && result.code == 0) {
            riot.mount('view', template, result.data);
        }
        else {
            web.message((result && result.message) || msg);
        }
    }

    function route() {
        var method = web._hashs.method;
        loading.show();
        switch (method) {
            case 'project':
                web.services.todo.list({project: web._hashs.project}, function (result) {
                    showList('todo_list', result);
                });
                break;
            case 'finished':
                web.services.todo.list({finished: true}, function (result) {
                    showList('todo_list', result);
                });
                break;
            case 'removed':
                web.services.todo.list({removed: true}, function (result) {
                    showList('removed', result);
                });
                break;
            case 'todo':
            default:
                web.services.todo.list(function (result) {
                    showList('removed', result);
                });
                break;
        }
    }

    riot.route(route);
    route();
});
