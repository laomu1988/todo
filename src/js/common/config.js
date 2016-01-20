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
        }
    }
};