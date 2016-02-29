web.route = function (page, param) {
    param = param || {};
    param.front_page = page || 'login';
    if (web._params.test) {
        param.test = web._params.test;
    }
    var url = '';
    for (var attr in param) {
        if (param[attr] + '' !== '') {
            url += (url ? '&' : '') + attr + '=' + param[attr];
        }
    }
    location.href = '?' + url;
};