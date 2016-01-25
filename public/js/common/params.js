web.params = function (url) {
    var array = url.split('&'), output = {};
    for (var i = 0; i < array.length; i++) {
        var keys = array[i].split('=');
        var key = keys[0] ? (keys[0] + '').trim() : '';
        if (key) {
            output[key] = keys[1] ? (keys[1] + '').trim() : '';
        }
    }
    return output;
};