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