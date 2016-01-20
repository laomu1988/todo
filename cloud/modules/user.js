module.exports = {
    new: function (req, res) {
        var d = gl.new('User', data);
        d.signUp(null, gl.send(res));
    },
    login: function (req, res) {
        var data = req.data;
        console.log('用户尝试登录：', data.username);
        gl.AV.User.logIn(data.username, data.password, gl.send(res, function (data) {
            data = JSON.parse(JSON.stringify(data));
            console.log('用户登录成功：', data.username);
            req.session.user = data;
        }))
    },
    isLogin: function (req) {
        var user = req.session.user;
        if (user && user.objectId) {
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