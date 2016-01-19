web.ondrag = function (e) {
    var target = e.currentTarget || e.target;
    web.__drag = target;
    return true;
};

web.ondragover = function (e) {
    e.preventDefault();
    return true;
};

web.ondrop = function (e) {
    var data = web.attrs(e.currentTarget || e.target);
    var src = web.attrs(web.__drag);
    if (!data || !src) {
        return false;
    }
    var drag = web.__drag;
    var name = drag.getAttribute('name'), id = drag.getAttribute('todo_id'), project_id = e.target.getAttribute('project_id');
    switch (data.method) {
        case 'project':
            // 修改project
            web.services.todo.edit({
                id: src.todo_id,
                project: data.project_id
            }, function (data) {
                if (data.code == 0) {
                    web.message('修改成功！');
                } else {
                    web.message('修改失败！');
                }
            });
            break;
        case 'removed':
            var services = null, id = null;
            if (src.todo_id) {
                id = src.todo_id;
                services = web.services.todo.remove;
            } else if (src.project_id) {
                id = src.project_id;
                services = web.services.project.remove;
            }
            if (services) {
                services(id, function (data) {
                    if (data.code == 0) {
                        web.message('删除成功！');
                        $(web.__drag).remove();
                    } else {
                        web.message('删除失败！');
                    }
                });
            }
            break;
        case 'finished':
            var services = null, id = null;
            if (src.todo_id) {
                id = src.todo_id;
                services = web.services.todo.finish;
            } else if (src.project_id) {
                id = src.project_id;
                services = web.services.project.finish;
            }
            if (services) {
                services(id, function (data) {
                    if (data.code == 0) {
                        web.message('修改成功！');
                    } else {
                        web.message('修改失败！');
                    }
                });
            }
            break;
    }
    return true;
};

