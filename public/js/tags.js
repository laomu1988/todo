/** ----- created by gulp-riot-css -----*/
riot.tag('alert', '<div class="modal fade bs-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel"> <div class="modal-dialog modal-sm"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button> <h4 class="modal-title" id="mySmallModalLabel">Small modal</h4> </div> <div class="modal-body"> {opts.message} </div> </div> </div> </div>', function(opts) {
        var self = this;
        self.on('mount', function () {
            $(self.root).find('.modal').modal();
        });
    
});
riot.tag('dialog', ' <div class="model" style="display: block;"> <div class="model-main"> <div class="close" onclick="{quit}"></div> <div class="model-head" if="{opts.data.head}">{opts.data.head || opts.data.title}</div> <div class="riot-tag"></div> </div> </div>', function(opts) {
        var self = this;
        self.quit = function () {
            $(self.root).hide();
            self.unmount();
        };
        self.on('mount', function () {

            var tag = $(self.root).find('.riot-tag')[0];
            (web.mount || riot.mount)(tag, opts.tag, opts.data);
        });
    
});
riot.tag('header', '<span> <i class="glyphicon glyphicon-user"></i> </span> <span class="pull-right" onclick="{login}"> <i class="glyphicon glyphicon-log-in"></i> 登录 </span> <span class="pull-right"> <i class="glyphicon glyphicon-log-out"></i> 退出 </span>', function(opts) {
        var self = this;
        self.login = function () {
            web.mount('login');
        }
    
});
riot.tag('login', '<div class="modal"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" onclick="{unmount}">&times;</span></button> <h4 class="modal-title">登录</h4> </div> <div class="modal-body"> <div class="form-group"> <label for="email">邮箱：</label> <input type="email" class="form-control" name="email" id="email" placeholder="请输入邮箱"> </div> <div class="form-group"> <label for="password">密码：</label> <input type="password" class="form-control" id="password" name="password" placeholder="请输入密码"> </div> </div> <div class="modal-footer"> <button type="submit" class="btn btn-primary" onclick="{login}">登录</button> <button type="button" class="btn btn-seconary">忘记密码</button> </div> </div> </div> </div>', function(opts) {
        var self = this;
        self.login = function () {
            var form = $(self.root);
            web.formSubmit(form, {
                services: 'login',
                callback: function (data) {
                    console.log(data);
                }
            });
        };
        self.on('mount', function () {
            $(self.root).find('.modal').modal();
        })
    
});
riot.tag('prompt', '<input type="text" value="{opts.input}"> <div class="btns"> <span class="button-inline main-bg" onclick="{callback}">确定</span> <span class="button-inline gray-bg" onclick="{quit}">取消</span> </div>', '[riot-tag=prompt],prompt { margin: 20px; } [riot-tag=prompt] input,prompt input { height: 35px; line-height: 35px; margin-bottom: 20px; } [riot-tag=prompt] .btns,prompt .btns { text-align: right; padding-bottom: 20px; }', function(opts) {
        var self = this;
        self.callback = function () {
            if (typeof self.opts.callback == 'function') {
                if (self.opts.callback($(self.root).find('input').val()) !== false) {
                    self.quit();
                }
            }
            else {
                self.quit();
            }
        };
        self.quit = function () {
            if (typeof self.opts.quit == 'function') {
                self.opts.quit();
            }
            $(self.root).parents('[riot-tag=dialog]').remove();
            self.unmount();
        };
    
});
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
