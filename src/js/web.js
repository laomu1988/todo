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