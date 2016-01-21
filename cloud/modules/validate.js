/** 表单字段验证*/
// 预处理
var handleRule = {
    trim: function (data) {
        return (data + '').trim();
    },
    float: function (data) {
        return parseFloat(data);
    },
    type: function (data, param) {

    }
};

// 验证规则
var validateRules = {
    // 不去空格
    min: function (val, param) {
        return parseFloat(val) >= parseFloat(param) ? false : '小于最小值' + param;
    },
    max: function (val, param) {
        return parseFloat(val) <= parseFloat(param) ? false : '超过最大值' + param;
    },
    required: function (val, param) {
        return (param && val) || !param ? false : '未填写！';
    },
    require: function (val, param) {
        return (param && val) || !param ? false : '未填写！';
    },
    maxlength: function (val, param) {
        val += '';
        return val.length <= param ? false : '超过限制长度' + (val.length - param) + '个字符！';
    },
    minlength: function (val, param) {
        val += '';
        return val.length >= param ? false : '最少输入' + param + '个字符！';
    },
    num: function (val) {
        return /^\s*\d*\s*$/.test(val) ? false : '必须是整数！';
    },
    number: function (val) {
        return /^\s*\d*\s*$/.test(val) ? false : '必须是整数！';
    },
    float: function (val) {
        return /^\s*\d*\.?\d*\s*$/.test(val) ? false : '必须是数字！';
    },
    password: function (val) {
        return (/^[\w\.\$\d_\@]*$/).test(val) ? false : '格式错误！';
    },
    email: function (val) {
        return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)*$/.test(val) ? false : '格式错误！'
    },
    engtext: function (val) {
        return (/^[\w\d_]*$/).test(val) ? false : '格式错误！';
    },
    nickname: function (val) {
        if (val && val.indexOf('@' >= 0)) {
            return validateRules.email(val);
        }
        return (/^[\w\d_\u4e00-\u9fa5]*$/).test(val) ? false : '格式错误！';
    }
};
var fieldRules = {
    // 电话号码
    'phone': {required: true, minlength: 11, maxlength: 11, number: true},
    // 验证码
    'valid': {required: true, minlength: 6, maxlength: 6},
    // 密码
    'password': {required: true, minlength: 4, maxlength: 40, password: true},
    'newPassword': {required: true, minlength: 4, maxlength: 40, password: true},
    'oldPassword': {required: true, minlength: 4, maxlength: 40, password: true},
    'email': {required: true, minlength: 6, maxlength: 40, email: true},
    'age': {required: true, number: true, maxlength: 3},
    'sex': {required: true, min: 1},
    'username': {required: true, minlength: 2, maxlength: 30, nickname: true},
    'name': {required: true, minlength: 2, maxlength: 30, nickname: true, maxlength: 6},
    'hospital': {required: true, maxlength: 30},
    'conditionDesc': {required: true, maxlength: 200}
};
var labels = {
    phone: '手机号',
    password: '密码',
    email: '邮箱',
};


module.exports = function (name, value, validate) {
    validate = validate || fieldRules[name];
    if (validate) {
        for (var ruleName in validate) {
            var rule = validateRules[ruleName];
            if (rule) {
                var result = rule(value, validate[ruleName]);
                if (result) {
                    return (labels[name] || name) + result;
                }
            } else {
                console.log('未定义匹配规则' + ruleName + '！')
            }
        }
        return false;
    } else {
        console.log(name + '未定义匹配规则！')
    }
    return false;
};