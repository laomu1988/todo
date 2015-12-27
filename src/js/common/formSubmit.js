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