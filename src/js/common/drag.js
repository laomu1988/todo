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
    var name = drag.getAttribute('name'), id = src['o_id'], type = src['o_type'] || 'todo';
    switch (data.method) {
        case 'project':
            // 修改所在project
            if (type == 'todo') {
                web.services.todo.edit({
                    id: id,
                    project: data['o_id']
                }, function (data) {
                    if (data.code == 0) {
                        web.message('修改成功！');
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
                        $(web.__drag).remove();
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
                        $(web.__drag).remove();
                    } else {
                        web.message('修改失败！');
                    }
                });
            }
            break;
    }
    return true;
};

