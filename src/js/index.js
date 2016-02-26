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
                web.services.project.get(web._hashs.project, function (result) {
                    if (result && result.data) {
                        result.data.type = 'project';
                    }
                    showList('view_detail', result);
                });
                break;
            case 'finished':
                web.services.project.list({finished: true, order: 'finish'}, function (result) {
                    showList('view-finished', result);
                });
                break;
            case 'removed':
                loading.hide();
                riot.mount('view', 'view-removed', {});
                break;
            case 'timeline':
                loading.hide();
                riot.mount('view', 'timeline', {});
                break;
            case 'today':
                web.services.todo.list({sign: 'today', finished: false}, function (result) {
                    showList('view_list', result);
                });
                break;
            case 'todo':
                web.services.todo.list(function (result) {
                    showList('view_list', result);
                });
                break;
            default:
                loading.hide();
                riot.mount('view', 'index');
                break;
        }
    }

    riot.route(route);
    route();
});
