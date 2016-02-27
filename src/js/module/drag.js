web.ondrag = function (e) {
    var target = e.currentTarget || e.target;
    web._drag = target;
    return true;
};
var _dragover = null;
web.ondragover = function (e) {
    _dragover && _dragover.removeClass('dragover');
    e.preventDefault();
    if (web._drag == e.target) {
        return true;
    }
    _dragover = $(e.target).addClass('dragover');
    return true;
};

web.ondrop = function (e) {
    _dragover && _dragover.removeClass('dragover');
    var data = web.attrs(e.currentTarget || e.target);
    var src = web.attrs(web._drag);
    if (!data || !src) {
        return false;
    }
    var drag = web._drag;
    var name = drag.getAttribute('name'), id = src['o_id'], type = src['o_type'] || 'todo';
    switch (data.method) {
        case 'todo':
            if (type == 'todo') {
                // 将一个任务拖动到另一个任务上面
                var pid = data['o_id'];
                var todo = web._todos[pid];
                if (todo && pid != id) {
                    web.confirm('你确定要将“' + web._todos[id].name + '”修改为“' + todo.name + '”的子任务吗？', function () {
                        web.services.todo.edit({
                            id: id,
                            pid: pid,
                            project: todo.project.objectId
                        }, function (data) {
                            if (data.code == 0) {
                                web.message('修改成功！');
                                $(web._drag).remove();
                            } else {
                                web.message('修改失败！');
                            }
                        });
                    });
                }

            }
            break;
        case 'project':
            // 修改所在project
            if (type == 'todo') {
                var project = data['o_id'];
                var todo = web._todos[id];
                if (todo.project.objectId == project) {
                    web.message('已在该项目内部，无需修改！');
                    return false;
                }

                web.services.todo.edit({
                    id: id,
                    project: data['o_id']
                }, function (data) {
                    if (data.code == 0) {
                        web.message('修改成功！');
                        $(web._drag).remove();
                    } else {
                        web.message('修改失败！');
                    }
                });
            }

            break;
        case 'removed':
            var services = web.services[type].remove;
            if (services) {
                services(id, function (data) {
                    if (data.code == 0) {
                        web.message('删除成功！');
                        $(web._drag).remove();
                    } else {
                        web.message('删除失败！');
                    }
                });
            }
            break;
        case 'finished':
            var services = web.services[type].finish;
            if (services) {
                services(id, function (data) {
                    if (data.code == 0) {
                        web.message('修改成功！');
                        $(web._drag).remove();
                    } else {
                        web.message('修改失败！');
                    }
                });
            }
            break;
    }
    return true;
};

