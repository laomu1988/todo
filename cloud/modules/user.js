var gl = global.gl;
function login(username, password, req, res) {
    gl.AV.User.logIn(username, password, gl.send(res, function (data) {
        data = JSON.parse(JSON.stringify(data));
        console.log('用户登录成功：', username);
        req.session.user = data;
    }));
}


module.exports = {
    new: function (req, res) {
        if (!req.data) {
            return gl.error(res, 400);
        } else if (req.data.password !== req.data.password2) {
            return gl.error(res, '两次输入的密码不一致！');
        }
        var user = gl.new('User', req.data);
        user.signUp(null, {
            success: function (data) {
                data = JSON.parse(JSON.stringify(data));
                console.log('注册成功：', data.username, data);
                req.session.user = data;
                res.json({code: 0, data: data});
                return;
            }, error: function (data, err) {
                res.json(err || data);
            }
        });
    },
    login: function (req, res) {
        console.log('用户尝试登录：', req.data.username);
        var data = req.data;
        var result = gl.validate('username', data.username) || gl.validate('password', data.password);
        if (result) {
            return res.json({code: 400, message: result});
        }
        gl.AV.User.logIn(data.username, data.password, gl.send(res, function (data) {
            data = JSON.parse(JSON.stringify(data));
            console.log('用户登录成功：', data.username, data);
            req.session.user = data;
            //console.log('session', req.session);
            //console.log('user', req.AV.user);
        }));
    },
    info: function (req, res) {
        var user = req.session.user;
        if (user) {
            res.json({code: 0, data: user});
        } else {
            gl.error(res, 'need_login');
        }
    },
    find: function (data, callback, error) {

    },
    isLogin: function (req) {
        var user = req.session.user;
        if (user) {
            console.log('已经登陆');
            return true;
        }
        console.log('还未登录');
        return null;
    },
    isAdmin: function () {

    },
    myRef: function (req) {
        //console.log('myRef:', req.session.user.objectId);
        return gl.withId('User', req.session.user.objectId);
    },
    logout: function (req, res) {
        gl.AV.User.logOut();
        req.session.user = null;
        res.send({code: 0, message: '退出登录成功！'});
    }
};