/** ----- created by gulp-riot-css -----*/
riot.tag('todo_list', '<div each="{opts.results}"> <input type="checkbox" value="" onclick="{finish}" todo_id="{objectId}">{name} </div>', function(opts) {
        var self = this;
        console.log(self.opts);
        self.finish = function (e) {
            var id = e.target.getAttribute('todo_id');
            web.services.todo.edit({id: id, finishDate: Date.now()}, function (data) {
                if (data && data.code == 0) {
                    alert('完成！');
                }
            });
        }
    
});

riot.tag('todo_new', '<input type="text" placeholder="新任务" onkeyup="{insert}">', function(opts) {
        var self = this;
        self.insert = function (e) {
            console.log(e.keyCode);
            if (e.keyCode == 13) {
                var val = e.target.value;
                web.services.todo.new({
                    name: val
                }, function (data) {
                    if (data && data.code == 0) {
                        alert('新任务：' + val);
                    }
                });
            }
        };
    
});
