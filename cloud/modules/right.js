module.exports = {
    needLogin: function (req, res, next) {
        // console.log('session.user', req.session.user);
        if (gl.user.isLogin(req)) {
            return next();
        }
        res.json({code: 1, message: '你还未登录'});
    },
    needAdmin: function (req, res, next) {
        if (gl.user.isAdmin()) {
            return next();
        }
        res.json({code: 1, message: '没有权限！'});
    }
};