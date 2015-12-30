var web = typeof web == 'undefined' ? {} : web;

riot.observable(web);

web.config = $.extend(web.config, {
    server: '/api/'
});
var config = web.config;
/**
 * 动态请求以及一些默认处理
 * */
web.get = function (page, data, callback) {
    if (typeof data === 'function') {
        callback = data;
        data = undefined;
    }
    if (!callback) {
        callback = function () {
        };
    }
    $.ajax({
        url: config.server + page,
        data: data,
        type: 'get',
        dataType: 'json',
        success: function (result) {
            web.config.onAjaxload && web.config.onAjaxload(result);
            callback(result);
        },
        error: function (err) {
            console.log(err);
            // todo: delete
            callback({
                errno: 405,
                message: '系统错误，请稍候再试.',
                errmsg: '系统错误，请稍候再试'
            });
        }
    });
};
web.post = function (page, data, callback) {
    if (typeof data === 'function') {
        callback = data;
        data = undefined;
    }
    if (!callback) {
        callback = function () {
        }
    }
    $.ajax({
        url: config.server + page,
        data: data,
        type: 'post',
        dataType: 'json',
        success: function (result) {
            web.config.onAjaxload && web.config.onAjaxload(result);
            callback(result);
        },
        error: function (err) {
            console.log(err);
            callback({
                errno: 405,
                message: '系统错误，请稍候再试.',
                errmsg: '系统错误，请稍候再试'
            });
        }
    });
};
web.services = {
    login: function (data, callback) {
        web.get('user/login', data, callback);
    },
    logout: function (data, callback) {
        web.setCookie('user', '');
        web.get('user/logout', data, callback);
    },
    todo: {
        new: function (data, callback) {
            web.get('todo/new', data, callback);
        },
        list: function (data, callback) {
            web.get('todo/list', data, callback);
        },
        edit: function (data, callback) {
            web.get('todo/edit', data, callback);
        },
        finish: function (todoId, callback) {
            web.services.todo.edit({
                id: todoId,
                finish: Date.now()
            }, callback);
        },
        unfinish: function (todoId, callback) {
            web.get('todo/unfinish', {id: todoId}, callback);
        },
        remove: function (todoId, callback) {
            web.services.todo.edit({
                id: todoId,
                removed: true
            }, callback);
        },
        unremove: function (todoId, callback) {
            web.services.todo.edit({
                id: todoId,
                removed: false
            }, callback);
        }

    },
    project: {
        new: function (data, callback) {
            web.get('project/new', data, callback);
        },
        list: function (data, callback) {
            web.get('project/list', data, callback);
        }
    }
};



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

/**
 * 字段验证部分
 * 需要jquery
 */
var validateRules = {
    // 不去空格
    notrim: {
        test: function () {
            return true;
        },
        msg: ''
    },
    min: {
        test: function (val, param) {
            return parseFloat(val) >= parseFloat(param);
        },
        msg: '格式错误！'
    },
    max: {
        test: function (val, param) {
            return parseFloat(val) <= parseFloat(param);
        },
        msg: '格式错误！'
    },
    required: {
        test: function (val, param) {
            if (param + '' == 'false' && !val) {
                return true;
            }
            return val ? true : false;
        },
        msg: '未填写！'
    },
    require: {
        test: function (val, param) {
            if (param + '' == 'false' && !val) {
                return true;
            }
            return val + '' ? true : false;
        },
        msg: '不能为空！'
    },
    maxlength: {
        test: function (val, param) {
            return (val + '').length <= param;
        },
        msg: '格式错误!'
    },
    minlength: {
        test: function (val, param) {
            return (val + '').length >= param;
        },
        msg: '格式错误！'
    },
    num: {
        test: function (val) {
            return /^\s*\d*\s*$/.test(val);
        },
        msg: '格式错误！'
    },
    number: {
        test: function (val) {
            return /^\s*\d*\s*$/.test(val);
        },
        msg: '格式错误！'
    },
    float: {
        test: function (val) {
            return /^\s*\d*\.?\d*\s*$/.test(val);
        },
        msg: '格式错误！'
    },
    password: {
        test: function (val) {
            return (/^[\w\.\$\d_]*$/).test(val);
        },
        msg: '格式错误！'
    },
    email: {
        test: function (val) {
            return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/.test(val);
        },
        msg: '格式错误！'
    },
    engtext: {
        test: function (val) {
            return (/^[\w\d_]*$/).test(val);
        },
        msg: '格式错误！'
    },
    nickname: {
        test: function (val) {
            return (/^[\w\d_\u4e00-\u9fa5]*$/).test(val);
        },
        msg: '格式错误！'
    }
};
var fieldRules = {
    // 电话号码
    'phone': {required: true, minlength: 11, maxlength: 11, number: true},
    // 验证码
    'valid': {required: true, minlength: 6, maxlength: 6},
    'validateCode': {required: true, minlength: 6, maxlength: 6},
    // 病人姓名
    'patientName': {required: true, maxlength: 6},

    // 'nickname': {required: true, minlength: 4, maxlength: 30, nickname: true},
    // 密码
    'password': {notrim: true, required: true, minlength: 4, maxlength: 40, password: true},
    'newPassword': {notrim: true, required: true, minlength: 4, maxlength: 40, password: true},
    'oldPassword': {notrim: true, required: true, minlength: 4, maxlength: 40, password: true},
    'email': {required: true, minlength: 6, maxlength: 40, email: true},
    'age': {required: true, number: true, maxlength: 3},
    'sex': {required: true, min: 1},
    'username': {required: true, minlength: 2, maxlength: 30, nickname: true},
    'name': {required: true, minlength: 2, maxlength: 30, nickname: true, maxlength: 6},
    'hospital': {required: true, maxlength: 30},
    'conditionDesc': {required: true, maxlength: 200}
};
var labels = {
    'phone': '手机号',
    'validateCode': '验证码',
    'trainName': '培训名称'
};
web.validate = function (value, fieldtypeOrRules, field) {
    var rules = typeof fieldtypeOrRules === 'string' ? fieldRules[fieldtypeOrRules] : fieldtypeOrRules;
    if (!rules || (field && field.attr('data-rule'))) {
        try {
            var data_rule = ($(field).attr('data-rule') + '').trim();
            if (data_rule.charAt(0) == '{') {
                rules = JSON.parse(data_rule);
            } else {
                rules = {};
                data_rule = data_rule.split(',');
                for (var i = 0; i < data_rule.length; i++) {
                    var d = data_rule[i].split(':');
                    if (d && d.length == 2) {
                        rules[d[0]] = d[1];
                    }
                }
                //console.log('rules-------', rules);
            }
        }
        catch (e) {
            rules = rules || {};
        }
    }
    //console.log('rules..', rules);
    if ($(field).attr('required')) {
        rules.required = $(field).attr('required');
    }
    if (!rules.notrim) {
        // 去除前后多余空格
        value = $.trim(value);
    }
    for (var rule in rules) {
        if (typeof rules[rule] === 'undefined') {
            continue;
        }
        var ruleinfo = validateRules[rule];
        if (!ruleinfo) {
            console.error('未定义的validate rule:' + rule);
            return '系统错误!'
        }
        if (!validateRules[rule].test(value, rules[rule])) {
            return validateRules[rule].msg;
        }
    }
    return false;
};

var selectorField = 'input[name],select[name],textarea[name]';
function fieldValue(form, field) {
    var name = '', that = null;
    if (typeof field === 'string') {
        name = field;
        that = form.find('[name=' + name + ']')
    } else {
        that = $(field);
        name = that.attr('name');
    }

    switch (that.attr('type')) {
        case 'radio':
            return form.find('[name=' + name + ']:checked').val();
        case 'checkbox':
            var temp = form.find("input[name=" + name + "]:checked");
            if (temp.length > 0) {
                var val = '';
                for (var j = 0; j < temp.length; j++) {
                    if (temp[j].value) {
                        val += val ? ',' + temp[j].value : temp[j].value;
                    }
                }
                return val;
            }
            return '';
        default:
            return that.val();
    }
}
web.validateForm = function (form, bindChangeClass) {
    if (!form || !form.find) {
        return console.error('未知表单信息');
    }
    var field = form.find(selectorField);
    var submit = form.find('#submit', '[name=submit]');
    if (!submit || submit.length == 0) {
        submit = form.find('.submit');
    }
    var names = {}, result = false;
    field.each(function (index, that) {
        that = $(that);
        var name = that.attr('name');
        if (typeof names[name] !== 'undefined') {
            return;
        }
        var val = fieldValue(form, that);
        var msg = web.validate(val, name, that);
        names[name] = !msg;
        if (msg && !result) {
            var labels = $('[for=' + name + ']');
            var text = '';
            if (labels.length > 0) {
                text = labels.first().text();
                if (!text) {
                    text = labels.text();
                }
            }
            var label = (text && text.replace(/[:\s：]*/g, '')) || labels[name];
            result = {
                field: that,
                message: label + msg
            };
        }
    });
    // console.log(names);
    if (bindChangeClass) {
        field.on('blur change keyup paste cut', function () {
            var that = $(this);
            var fields = that;
            var name = that.attr('name');
            console.log('trigger change');
            if (that.attr('type') == 'radio' || that.attr('type') == 'checkbox') {
                that = that.parent();
                if (that[0] && that[0].tagName.toLowerCase() == 'label') {
                    that = that.parent();
                }
                fields = form.find('[name=' + name + ']');
            }
            var msg = web.validate(fieldValue(form, name), name, fields);
            if (msg) {
                that.addClass(bindChangeClass);
                submit.addClass('disabled');
                names[name] = false;
                console.log('disable');
            } else {
                that.removeClass(bindChangeClass);
                names[name] = true;
                console.log(names);
                for (var i in names) {
                    if (i && !names[i]) {
                        console.log(i + ' disabled');
                        submit.addClass('disabled');
                        return;
                    }
                }
                submit.removeClass('disabled');
                console.log('remove disable');
            }
        });
    }
    if (!result) {
        submit.removeClass('disabled');
    } else if (bindChangeClass) {
        submit.addClass('disabled');
    }
    return result;
};

web.formVal = function (form) {
    var field = form.find(selectorField);
    var values = {};
    field.each(function (index, that) {
        that = $(that);
        var name = that.attr('name');
        values[name] = fieldValue(form, that);
    });
    return values;
};

web.ajaxform = function (form, callback) {
    if (!form || !form.length > 0) {
        return;
    }
    if (!callback) {
        callback = function (result) {
            if (result.msg) {
                alert(result.msg);
            }
            if (result.location) {
                location.href = result.location;
            }
            else if (result.ret == 0) {
                history.go(0);
            } else if (!result.msg && result.field) {
                var field = form.find("[for=" + result.field + "]");
                if (field.length > 0) {
                    alert(field.text() + "数据格式有误！");
                }
            }
        };
    }
    if (form.length > 1) {
        form.each(function () {
            web.ajaxform($(this), callback);
        });
        return;
    }

    var submit = form.find('#submit', '[name=submit]');
    if (!submit || submit.length == 0) {
        submit = form.find('.submit');
    }
    submit.click(function () {
        form.trigger('submit');
    });

    $(form).submit(function () {
        var result = web.validateForm(form);
        if (result && result.message) {
            return web.message(result.message);
        }
        var data = web.formVal(form);
        $.ajax(form.attr("action"), {
            'data': data,
            'method': $(this).attr("method") || 'post',
            'dataType': 'json',
            'success': function (data) {
                callback(web.ajaxHandle(data));
            },
            'error': function (err) {
                callback($.parseJSON(err.responseText));
            }
        });
        return false;
    });
    return form;
};
/**
 * 手机端表单提交验证
 * form 要提交的表单信息
 * config:
 *      操作处理内容或者直接执行的回调函数
 *      services 提交接口
 *      before 提交前验证,假如存在该项,只有在改项目返回true时,才会提交数据到服务器,函数参数是表单数据
 *      callback: 成功后调用
 *      error: 错误后调用
 *      route: 成功后跳转地址
 * */
web.formSubmit = function (form, config) {
    // 验证字段
    var result = web.validateForm(form);
    if (result) {
        web.message(result.message || result.error);
        return false;
    }

    // 假如存在电话号码,则需要验证电话号码
    var phone = form.find('input[name=phone]');
    if (phone && phone.length > 0) {
        var valid = form.find('input[validateCode]');
        if (valid && valid.length > 0 && phone.val().trim() !== web._valid_phone) {
            web.message("电话号码被更改，请重新获取验证码！");
            return false;
        }
    }
    var data = web.formVal(form);
    if (typeof config.before === 'function') {
        if (!config.before(data)) {
            return;
        }
    }
    if (config) {
        if (typeof config === 'function') {
            config(data);
        }
        else if (config.services && web.services[config.services]) {
            web.services[config.services](data, function (result) {
                console.log(result);
                if (result && result.code == 0) {
                    if (config.callback) {
                        config.callback(result);
                    }
                    if (config.route) {
                        web.route(config.route);
                    }
                } else {
                    web.message((result && result.message) || '系统错误,请稍候再试!');
                    if (config.error) {
                        config.error(result);
                    }
                }
            });
        } else {
            console.log('不存在回调地址！');
        }
    }
    return data;
};

web.dialog = function (tag, data) {
    var dom = $('<div></div>').appendTo($('body'));
    return riot.mount(dom[0], 'dialog', {tag: tag, data: data});
};


web.alert = function (message) {
    return web.mount('alert', {message: message})
};

web.message = function (message) {
    var dom = $('<div class="model_message"><div class="message">' + message + '</div></div>').appendTo($('body'));
    /*setTimeout(function () {
        dom.fadeOut(function () {
            dom.remove();
        });
    }, 1000);*/
};
web.prompt = function (data) {
    web.dialog('prompt', data);
};

web.isLogin = function () {
    return !!web.getUser();
};

web.getUser = function () {
    var user = web.getCookie('user', 'json');
    if (user && user.username) {
        return user;
    }
    return false;
};



web.mount = function (tag, data) {
    var dom = $('<div></div>').appendTo($('body'));
    return riot.mount(dom[0], tag, data);
};

$(function(){
    riot.mount('header');
    riot.mount('menu');

});