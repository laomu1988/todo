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