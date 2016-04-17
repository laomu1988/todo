var web = {};
// 一些暂存数据
web._hashs = {}; //链接hashs数据
web._projects = {}; // 项目数据
web._todos = {}; //任务数据列表
web._user = null; //用户信息
web._drag = null; // 用户拖动的内容
var config = web.config = {
    server: '/api/',
    onAjaxload: function (result) {
        if (result && result.code == 401) {
            var login = $('[riot-tag=login]');
            if (login && login.length > 0) {
                login.find('.modal').modal();
            } else {
                web.mount('login');
            }
        } else if (result && result.code == 0 && result.data && result.data.className && result.data.results.forEach) {
            var temp = null;
            switch (result.data.className) {
                case 'Project':
                    temp = web._projects;
                    break;
                case 'Todo':
                    temp = web._todos;
                    break;
            }
            if (temp) {
                result.data.results.forEach(function (result) {
                    if (result && result.objectId) {
                        temp[result.objectId] = result;
                    }
                });
            }
        }
    }
};
var web = typeof web == 'undefined' ? {} : web;

riot.observable(web);

web.ajax = function (type, page, data, callback) {
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
        type: type,
        dataType: 'json',
        success: function (result) {
            if (result) {
                result.ajax_data = {type: type, data: data, page: page};
            }
            web.config.onAjaxload && web.config.onAjaxload(result);
            callback(result);
        },
        error: function (err) {
            console.log(err);
            // todo: delete
            callback({
                ajax_data: {type: type, data: data, page: page},
                errno: 405,
                message: '系统错误，请稍候再试.',
                errmsg: '系统错误，请稍候再试'
            });
        }
    });
};

/**
 * 动态请求以及一些默认处理
 * */
web.get = function (page, data, callback) {
    web.ajax('get', page, data, callback);
};
web.post = function (page, data, callback) {
    web.ajax('post', page, data, callback);
};
web.services = {
    user: {
        register: function (data, callback) {
            web.get('user/register', data, callback);
        },
        login: function (data, callback) {
            web.get('user/login', data, callback);
        },
        logout: function (data, callback) {
            web.setCookie('user', '');
            web.get('user/logout', data, callback);
        },
        info: function (data, callback) {
            web.get('user/info', data, callback);
        }
    },
    todo: {
        new: function (data, callback) {
            web.get('todo/new', data, callback);
        },
        get: function (todoId, callback) {
            web.get('todo/get', {id: todoId}, callback);
        },
        list: function (data, callback) {
            web.get('todo/list', data, callback);
        },
        edit: function (data, callback) {
            web.get('todo/edit', data, callback);
        },
        finish: function (id, callback) {
            web.get('todo/finish', {id: id}, callback);
        },
        unfinish: function (id, callback) {
            web.get('todo/unfinish', {id: id}, callback);
        },
        remove: function (id, callback) {
            web.get('todo/remove', {id: id}, callback);
        },
        unremove: function (id, callback) {
            web.get('todo/unremove', {id: id}, callback);
        }
    },
    project: {
        new: function (data, callback) {
            web.get('project/new', data, callback);
        },
        get: function (id, callback) {
            web.get('project/get', {id: id}, callback);
        },
        list: function (data, callback) {
            web.get('project/list', data, callback);
        },
        edit: function (data, callback) {
            web.get('project/edit', data, callback);
        },
        finish: function (id, callback) {
            web.get('project/finish', {id: id}, callback);
        },
        unfinish: function (id, callback) {
            web.get('project/unfinish', {id: id}, callback);
        },
        remove: function (id, callback) {
            web.get('project/remove', {id: id}, callback);
        },
        unremove: function (id, callback) {
            web.get('project/unremove', {id: id}, callback);
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
            return (/^[\w\d_\u4e00-\u9fa5\@\.]*$/).test(val);
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
        else if (config.services) {
            config.services(data, function (result) {
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
/**@ dom节点上的所有属性
 *@description: 如：<div class="a" if="b"></div> 将生成对象{class:"a",if:"b"}
 * */
web.attrs = function (dom) {
    if (!dom) {
        return null;
    }
    if (dom.length) {
        dom = dom[0];
    }
    var attrs = dom.attributes;
    if (attrs) {
        var result = {};
        for (var i = 0; i < attrs.length; i++) {
            result[attrs[i].nodeName] = attrs[i].nodeValue;
        }
        return result;
    } else {
        return null;
    }
};



web.ondrag = function (e) {
    var target = e.currentTarget || e.target;
    web._drag = target;
    return true;
};
var _dragover = null, _dragover_class = '';
web.ondragover = function (e) {
    _dragover && _dragover.removeClass('dragover');
    _dragover && _dragover_class && _dragover.removeClass(_dragover_class);
    _dragover = $(e.currentTarget || e.target);
    if (_dragover[0] == web._drag[0]) {
        _dragover_class = '';
    } else {
        _dragover_class = _dragover.attr('dragover_class');
        if (_dragover_class) {
            _dragover.addClass('dragover');
        }
    }
    e.preventDefault();
    if (web._drag == e.target) {
        return true;
    }
    _dragover = $(e.target).addClass('dragover');
    return true;
};
web.ondragleave = function (e) {
    _dragover && _dragover_class && _dragover.removeClass(_dragover_class);
};
web.ondrop = function (e) {
    _dragover && _dragover_class && _dragover.removeClass(_dragover_class);
    var data = web.attrs(e.currentTarget || e.target);
    var src = web.attrs(web._drag);
    if (!data || !src) {
        return false;
    }
    var drag = web._drag;
    var name = drag.getAttribute('name'), id = src['o_id'], type = src['o_type'] || 'todo';
    switch (data.method) {
        case 'todo':
            if (type == 'todo') {
                // 将一个任务拖动到另一个任务上面
                var anthor_id = data['o_id'];
                if (data.weight && anthor_id != id) {
                    // 改为移动上下顺序
                    web.services.todo.edit({id: id, weight: data.weight}, function (result) {
                        if (result.code == 0) {
                            web.message('修改成功！');
                            web._todos[id].weight = parseFloat(data.weight) + 0.1;
                            web.trigger('change-weight', {id: id, weight: data.weight});
                        } else {
                            web.message('修改失败！');
                        }
                    });

                    /*
                     web.confirm('你确定要将“' + web._todos[id].name + '”修改为“' + todo.name + '”的子任务吗？', function () {
                     web.services.todo.edit({id: id, pid: pid, project: todo.project.objectId}, function (data) {
                     if (data.code == 0) {
                     web.message('修改成功！');
                     $(web._drag).remove();
                     } else {
                     web.message('修改失败！');
                     }
                     });
                     });*/
                }

            }
            break;
        case 'project':
            // 修改所在project
            if (type == 'todo') {
                var project = data['o_id'];
                var todo = web._todos[id];
                if (todo.project.objectId == project) {
                    web.message('已在该项目内部，无需修改！');
                    return false;
                }

                web.services.todo.edit({
                    id: id,
                    project: data['o_id']
                }, function (data) {
                    if (data.code == 0) {
                        web.message('修改成功！');
                        $(web._drag).remove();
                    } else {
                        web.message('修改失败！');
                    }
                });
            }

            break;
        case 'removed':
            var services = web.services[type].remove;
            if (services) {
                services(id, function (data) {
                    if (data.code == 0) {
                        web.message('删除成功！');
                        $(web._drag).remove();
                    } else {
                        web.message('删除失败！');
                    }
                });
            }
            break;
        case 'finished':
            var services = web.services[type].finish;
            if (services) {
                services(id, function (data) {
                    if (data.code == 0) {
                        web.message('修改成功！');
                        $(web._drag).remove();
                    } else {
                        web.message('修改失败！');
                    }
                });
            }
            break;
    }
    return true;
};


// 取得该日期的相关信息: 本月天数，上个月天数，本月第一天星期 [{date: "2015-12-27",day: 27,prevmonth: true,nextmonth:false},……]
web.getMonthArray = function (date) {
    date = date || new Date();
    var month = date.getMonth() + 1, year = date.getFullYear(), date = date.getDate(), month2 = month - 1, year2 = year, month3 = month + 1, year3 = year;
    self.year = year, self.month = month;
    if (month2 < 1) {
        year2 -= 1;
        month2 = 12;
    }
    if (month3 > 12) {
        month3 = 1;
        year3 += 1;
    }
    var day = web.getMonthDay(month, year), day2 = web.getMonthDay(month2, year2);
    var week = (new Date(year + '-' + month + '-1')).getDay() || 7;
    data = {
        year: year,
        month: month,
        day: day,
        month2: month2,
        year2: year2,
        day2: day2,
        month3: month3,
        year3: year3,
        day3: web.getMonthDay(month3, year3)
    };
    var arr = [];
    for (var i = 0; i < week; i++) {
        arr.unshift({date: year2 + '-' + month2 + '-' + (day2 - i), day: day2 - i, prevmonth: true});
    }
    for (var i = 1; i <= day; i++) {
        arr.push({date: year + '-' + month + '-' + i, day: i, choosed: i == date});
    }
    i = 1;
    while (arr.length < 42) {
        arr.push({date: year3 + '-' + month3 + '-' + i, day: i, nextmonth: true});
        i += 1;
    }
    return arr;
};

// 取得某一个时间所属的星期开始节点和结束节点，整数格式
web.getWeekRange = function (date) {
    date = typeof date == 'number' ? date : (date && date.getTime ? date.getTime() : Date.now());
    var start = date - (date - 64 * 60 * 60 * 1000) % (7 * 24 * 60 * 60 * 1000); //每一周开始时间
    return {begin: start, finish: start + 7 * 24 * 60 * 60 * 1000}
};

web.now = Date.now();

// 修正开始时间和结束时间到某天开始或结束
web.fixDate = function (todo) {
    todo.last = (todo.finish ? (todo.finish - todo.begin) / (24 * 60 * 60 * 1000) : 100).toFixed(2);
    todo.begin = todo.begin - (todo.begin - 16 * 60 * 60 * 1000) % (24 * 60 * 60 * 1000);
    todo.finish = todo.finish > 0 ? todo.finish - (todo.finish - 16 * 60 * 60 * 1000) % (24 * 60 * 60 * 1000) + 24 * 60 * 60 * 1000 : 0;
    todo.finished = todo.finish > 0 && todo.finish < web.now;

    todo.last2 = (todo.finish ? (todo.finish - todo.begin) / (24 * 60 * 60 * 1000) : 100).toFixed(2);
};

// 取得该月份的天数
web.getMonthDay = function (month, year) {
    if (month == 2) {
        if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {
            return 29;
        } else {
            return 28;
        }
    } else {
        switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
            default:
                return 30;
        }
    }
}


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
    web.dialog('edit_todo', {title: '新任务'});
};
web.new_project = function () {
    web.dialog('edit_project', {title: '新项目'});
};

web.finish = function (e, callback) {
    var target = e.currentTarget || e.target || e;
    if (target.getAttribute) {
        var check = target.checked, type = target.getAttribute('o_type') || 'todo';
        var services = web.services[type][!check ? 'unfinish' : 'finish'];
        var id = target.getAttribute('o_id');
        services(id, function (data) {
            if (data && data.code == 0) {
                web.message('操作成功！');
                web.trigger(check ? 'finish' : 'unfinish', id);
            } else {
                web.message((data && data.message) || '操作失败！');
            }
        });
    } else {
        console.error('web.finish参数错误！');
    }
    if (e.preventDefault && target.getAttribute('prevent')) {
        e.preventDefault();
    }
    return false;
};

web.edit = function (e) {
    var target = e.currentTarget || e.target || e;
    if (target.getAttribute) {
        var type = target.getAttribute('o_type') || 'todo';
        web.services[type].get(target.getAttribute('o_id'), function (result) {
            if (result && result.code == 0 && result.data) {
                web.dialog('edit_' + type, {title: type == 'todo' ? '任务详情' : '项目详情', data: result.data});
            } else {
                web.errmsg(result, '未找到内容！')
            }
        });
    } else {
        console.error('web.edit参数错误！');
    }
};

web.remove = function (e, callback) {
    var target = e.currentTarget || e.target || e;
    if (target.getAttribute) {
        var type = target.getAttribute('o_type') || 'todo';
        web.services[type].remove(target.getAttribute('o_id'), function (result) {
            if (result && result.code == 0 && result.data) {
                web.message('删除成功！');
                if (typeof callback === 'function') {
                    callback();
                } else {
                    $(target).parent().fadeOut();
                }
            } else {
                web.errmsg(result, '操作失败！')
            }
        });
    } else {
        console.error('web.remove参数错误！');
    }
};

web.unremove = function (e) {
    var target = e.currentTarget || e.target || e;
    if (target.getAttribute) {
        var type = target.getAttribute('o_type') || 'todo';
        web.services[type].unremove(target.getAttribute('o_id'), function (result) {
            if (result && result.code == 0 && result.data) {
                web.message('取消删除成功！');
                if (typeof callback === 'function') {
                    callback();
                } else {
                    $(target).parent().fadeOut();
                }
            } else {
                web.errmsg(result, '操作失败！')
            }
        });
    } else {
        console.error('web.unremove参数错误！');
    }
};