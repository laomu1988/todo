web.dialog = function (tag, data) {
    var dom = $('<div></div>').appendTo($('body'));
    return riot.mount(dom[0], 'dialog', {tag: tag, data: data});
};