web.dialog = function (tag, data) {
    var dom = $('<div></div>').appendTo($('body'));
    return riot.mount(dom[0], 'dialog', {tag: tag, data: data});
};

web.confirm = function (message, callback, quit) {
    return web.dialog('', {type: 'confirm', title: '请确认', message: message, callback: callback, quit: quit})
};

web.alert = function (message, callback) {
    return web.dialog('', {type: 'alert', title: '提示消息', message: message, callback: callback})
};

web.message = function (message) {
    var dom = $('<div class="model_message"><div class="message">' + message + '</div></div>').appendTo($('body'));
    setTimeout(function () {
        dom.fadeOut(function () {
            dom.remove();
        });
    }, 1000);
};
