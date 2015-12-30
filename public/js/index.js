$(function () {
    if (web.isLogin) {
        riot.mount('todo_new');
        web.services.todo.list(function (result) {
            if (result && result.code == 0) {
                riot.mount('todo_list', result.data);
            }
        });
    }

    /*riot.mount('header');
     web.services.login({username: 'laomu1988', password: '123456'}, function () {
     // web.services.todo.new({name: 'test'});
     riot.mount('.todo_new', 'todo_new');

     web.services.todo.list({finished: true}, function (result) {
     if (result && result.code == 0) {
     riot.mount('.todo_finished','todo_list', result.data);
     }
     });
     //web.services.project.list();
     })*/
});
