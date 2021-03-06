var web = {};
// 一些暂存数据
web._hashs = {}; //链接hashs数据
web._projects = {}; // 项目数据
web._todos = {}; //任务数据列表
web._user = null; //用户信息
web._drag = null; // 用户拖动的内容
// import('module/config.js');
// import('common/common.js');

// import('module/drag.js');
// import('module/timeline.js');


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
    web.dialog('edit_todo', {title: '新任务'});
};
web.new_project = function () {
    web.dialog('edit_project', {title: '新项目'});
};

web.finish = function (e, callback) {
    var target = e.currentTarget || e.target || e;
    if (target.getAttribute) {
        var check = target.checked, type = target.getAttribute('o_type') || 'todo';
        var services = web.services[type][!check ? 'unfinish' : 'finish'];
        var id = target.getAttribute('o_id');
        services(id, function (data) {
            if (data && data.code == 0) {
                web.message('操作成功！');
                web.trigger(check ? 'finish' : 'unfinish', id);
            } else {
                web.message((data && data.message) || '操作失败！');
            }
        });
    } else {
        console.error('web.finish参数错误！');
    }
    if (e.preventDefault && target.getAttribute('prevent')) {
        e.preventDefault();
    }
    return false;
};

web.edit = function (e) {
    var target = e.currentTarget || e.target || e;
    if (target.getAttribute) {
        var type = target.getAttribute('o_type') || 'todo';
        web.services[type].get(target.getAttribute('o_id'), function (result) {
            if (result && result.code == 0 && result.data) {
                web.dialog('edit_' + type, {title: type == 'todo' ? '任务详情' : '项目详情', data: result.data});
            } else {
                web.errmsg(result, '未找到内容！')
            }
        });
    } else {
        console.error('web.edit参数错误！');
    }
};

web.remove = function (e, callback) {
    var target = e.currentTarget || e.target || e;
    if (target.getAttribute) {
        var type = target.getAttribute('o_type') || 'todo';
        web.services[type].remove(target.getAttribute('o_id'), function (result) {
            if (result && result.code == 0 && result.data) {
                web.message('删除成功！');
                if (typeof callback === 'function') {
                    callback();
                } else {
                    $(target).parent().fadeOut();
                }
            } else {
                web.errmsg(result, '操作失败！')
            }
        });
    } else {
        console.error('web.remove参数错误！');
    }
};

web.unremove = function (e) {
    var target = e.currentTarget || e.target || e;
    if (target.getAttribute) {
        var type = target.getAttribute('o_type') || 'todo';
        web.services[type].unremove(target.getAttribute('o_id'), function (result) {
            if (result && result.code == 0 && result.data) {
                web.message('取消删除成功！');
                if (typeof callback === 'function') {
                    callback();
                } else {
                    $(target).parent().fadeOut();
                }
            } else {
                web.errmsg(result, '操作失败！')
            }
        });
    } else {
        console.error('web.unremove参数错误！');
    }
};