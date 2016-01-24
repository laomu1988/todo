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
        } else if (result && result.code == 0 && result.data && result.data.className && result.data.results.forEach) {
            var temp = null;
            switch (result.data.className) {
                case 'Project':
                    temp = web._projects;
                    break;
                case 'Todo':
                    temp = web._todos;
                    break;
            }
            if (temp) {
                result.data.results.forEach(function (result) {
                    if (result && result.objectId) {
                        temp[result.objectId] = result;
                    }
                });
            }
        }
    }
};