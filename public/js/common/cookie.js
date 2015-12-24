/** cookie 设置与获取 */
web.getCookie = function getCookie(key, type) {
    var cookieString = '; ' + document.cookie;
    key = '; ' + key;
    var start = cookieString.indexOf(key + '=');
    if (start === -1) {
        return undefined;
    }
    start += key.length + 1;
    var end = cookieString.indexOf(';', start);
    var result = end === -1 ? unescape(cookieString.substring(start)) : result = unescape(cookieString.substring(start, end));
    if (type == 'json' || type == 'object' || result.indexOf('{') >= 0) {
        try {
            result = JSON.parse(result);
        }
        catch (e) {

        }
    }
    return result;
}
web.setCookie = function (key, value, expires, path) {
    if (typeof value == 'object') {
        try {
            value = JSON.stringify(value);
        } catch (e) {
        }
    }
    var exp = new Date();
    var path = path || '/';
    exp.setTime(exp.getTime() + expires);
    document.cookie = key + "=" + escape(value) + ";path=" + path + ";expires=" + exp.toGMTString();
};

if (window.sessionStorage) {
    web.setCookie = function (key, value) {
        if (typeof value == 'object') {
            try {
                value = JSON.stringify(value);
            } catch (e) {
            }
        }
        window.sessionStorage[key] = value;
    }
    web.getCookie = function (key, type) {
        var result = window.sessionStorage[key];
        if (type == 'json' || type == 'object') {
            try {
                result = JSON.parse(result);
            }
            catch (e) {
            }
        }
        return result;
    }
}