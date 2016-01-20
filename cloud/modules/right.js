module.exports = {
    needLogin: function (req, res, next) {
        // console.log('session.user', req.session.user);
        if (gl.user.isLogin(req)) {
            return next();
        }
        gl.error(res, 'need_login');
    },
    needAdmin: function (req, res, next) {
        if (gl.user.isAdmin()) {
            return next();
        }
        gl.error(res, 'need_right');
    }
};