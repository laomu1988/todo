// import('common/common.js');

web.mount = function (tag, data) {
    var dom = $('<div></div>').appendTo($('body'));
    return riot.mount(dom[0], tag, data);
};

web.message = function (message){
    return web.mount('alert',{message: message})
};
