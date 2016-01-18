web.dialog = function (tag, data) {
    var dom = $('<div></div>').appendTo($('body'));
    return riot.mount(dom[0], 'dialog', {tag: tag, data: data});
};


web.alert = function (message) {
    return web.mount('alert', {message: message})
};

web.message = function (message) {
    var dom = $('<div class="model_message"><div class="message">' + message + '</div></div>').appendTo($('body'));
    setTimeout(function () {
        dom.fadeOut(function () {
            dom.remove();
        });
    }, 1000);
};