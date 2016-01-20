$(function () {
    var loading = $('.loading');

    function showList(result, msg) {
        loading.hide();
        msg = msg || '加载失败！';
        if (result && result.code == 0) {
            riot.mount('todo_list', result.data);
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
                    showList(result, '加载失败！');
                });
                break;
            case 'finished':
                web.services.todo.list({finished: true}, function (result) {
                    showList(result, '加载失败！');
                });
                break;
            case 'removed':
                web.services.todo.list({removed: true}, function (result) {
                    showList(result, '加载失败！');
                });
                break;
            case 'todo':
            default:
                web.services.todo.list(function (result) {
                    showList(result, '加载失败！');
                });
                break;
        }
    }

    riot.route(route);
    route();
});
