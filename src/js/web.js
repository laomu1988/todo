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