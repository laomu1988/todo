web.ondrag = function (e) {
    var target = e.currentTarget || e.target;
    web._drag = target;
    return true;
};
var _dragover = null, _dragover_class = '';
web.ondragover = function (e) {
    _dragover && _dragover_class && _dragover.removeClass(_dragover_class);
    _dragover = $(e.currentTarget || e.target);
    if (_dragover[0] == web._drag[0]) {
        _dragover_class = '';
    } else {
        _dragover_class = _dragover.attr('dragover_class');
        if (_dragover_class) {
            _dragover.addClass('dragover');
        }
    }
    e.preventDefault();
    return true;
};
web.ondragleave = function (e) {
    _dragover && _dragover_class && _dragover.removeClass(_dragover_class);
};
web.ondrop = function (e) {
    _dragover && _dragover_class && _dragover.removeClass(_dragover_class);
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
                var anthor_id = data['o_id'];
                if (data.weight && anthor_id != id) {
                    // 改为移动上下顺序
                    web.services.todo.edit({id: id, weight: data.weight}, function (result) {
                        if (result.code == 0) {
                            web.message('修改成功！');
                            web._todos[id].weight = parseFloat(data.weight) + 0.1;
                            web.trigger('change-weight', {id: id, weight: data.weight});
                        } else {
                            web.message('修改失败！');
                        }
                    });

                    /*
                     web.confirm('你确定要将“' + web._todos[id].name + '”修改为“' + todo.name + '”的子任务吗？', function () {
                     web.services.todo.edit({id: id, pid: pid, project: todo.project.objectId}, function (data) {
                     if (data.code == 0) {
                     web.message('修改成功！');
                     $(web._drag).remove();
                     } else {
                     web.message('修改失败！');
                     }
                     });
                     });*/
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

