module.exports = {
    new: function (req, res) {
        var d = gl.new('User', data);
        d.signUp(null, gl.send(res));
    },
    login: function (req, res) {
        var data = req.data;
        console.log('用户尝试登录：', data.username);
        console.log(gl.send);
        var ret = gl.send(res, function (data) {
            data = JSON.parse(JSON.stringify(data));
            console.log('用户登录成功：', data.username);
            req.session.user = data;
        });
        gl.AV.User.logIn(data.username, data.password, ret)
    }
    ,
    isLogin: function (req) {
        var user = req.session.user;
        if (user && user.objectId) {
            console.log('已经登陆');
            return true;
        }
        console.log('还未登录');
        return null;
    }
    ,
    isAdmin: function () {

    }
    ,
    myRef: function () {
        console.log('myRef:', gl.req.session.user.objectId);
        return gl.withId('User', gl.req.session.user.objectId);
    }
    ,
    myInfo: function () {
        return gl.req.session.user;
    }
    ,
    logout: function (res) {

    }
};