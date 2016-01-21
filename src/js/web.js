// import('common/common.js');

web.mount = function (tag, data) {
    var dom = $('<div></div>').appendTo($('body'));
    return riot.mount(dom[0], tag, data);
};
web._hashs = web.params(location.hash.substr(1));

riot.route.parser(function () {
    web._hashs = web.params(location.hash.substr(1));
    return [web._hashs];
});

$(function () {
    riot.mount('header');
    riot.mount('menu');

});

web.errmsg = function (result, msg) {
    web.message((result && result.message) || msg);
};

web.new_todo = function () {
    web.dialog('edit', {title: '新任务', type: 'todo'});
};
web.new_project = function () {
    web.dialog('edit', {title: '新项目', type: 'project'});
};

web.finish = function (e) {
    var target = e.currentTarget || e.target || e;
    if (target.getAttribute) {
        var check = target.checked, type = target.getAttribute('o_type');
        var services = web.services[type][!check ? 'unfinish' : 'finish'];
        services(target.getAttribute('o_id'), function (data) {
            if (data && data.code == 0) {
                web.message('操作成功！');
                if (type == 'todo') {
                    $(e.target).parent().remove();
                }
            } else {
                web.message((data && data.message) || '操作失败！');
            }
        });
    } else {
        console.error('web.finish参数错误！');
    }
    return false;
};