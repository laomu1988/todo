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
riot.tag('header', '<span> <i class="glyphicon glyphicon-user"></i> {user.username} </span> <span class="pull-right" onclick="{login}" if="{!isLogin}"> <i class="glyphicon glyphicon-log-in"></i> 登录 </span> <span class="pull-right" onclick="{register}" if="{!isLogin}"> <i class="glyphicon glyphicon-expand"></i> 注册 </span> <span class="pull-right" if="{isLogin}" onclick="{logout}"> <i class="glyphicon glyphicon-log-out"></i> 退出 </span>', function(opts) {
        var self = this;
        self.login = function () {
            web.mount('login');
        };
        self.logout = function () {
            web.services.logout(function () {
                self.user = web.getUser();
                self.isLogin = !!self.user;
                self.update();
            });
        };

        self.register = function () {
            web.mount('register');
        };
        self.user = web.getUser();
        self.isLogin = !!self.user;
        web.on('login', function () {
            self.user = web.getUser();
            self.isLogin = !!self.user;
            self.update();
        });
        web.on('update', function () {
            self.user = web.getUser();
            self.isLogin = !!self.user;
            self.update();
        });
    
});
riot.tag('login', '<div class="modal"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" onclick="{unmount}">&times;</span></button> <h4 class="modal-title">登录</h4> </div> <div class="modal-body"> <div class="form-group"> <label for="username">用户：</label> <input type="text" class="form-control" name="username" id="username" placeholder="请输入用户名"> </div> <div class="form-group"> <label for="password">密码：</label> <input type="password" class="form-control" id="password" name="password" placeholder="请输入密码"> </div> </div> <div class="modal-footer"> <button type="submit" class="btn btn-primary" onclick="{login}">登录</button> <button type="button" class="btn btn-seconary">忘记密码</button> </div> </div> </div> </div>', function(opts) {
        var self = this;
        self.login = function () {
            var form = $(self.root);
            web.formSubmit(form, {
                services: 'login',
                callback: function (data) {
                    if (data && data.code == 0 && data.data.username) {
                        web.setCookie('user', data.data);
                        $(self.root).find('.modal').modal('hide');
                        self.unmount();
                        web.trigger('update');
                    }
                }
            });
        };
        self.on('mount', function () {
            $(self.root).find('.modal').modal();
        })
    
});
riot.tag('menu', ' <div>新建</div> <ul> <li> <a href="#method=new&type=todo"><i class="glyphicon glyphicon-plus"></i> 新任务</a></li> <li> <a href="#method=new&type=project"><i class="glyphicon glyphicon-list-alt"></i> 新项目</a> </li> </ul> <div>查看</div> <ul> <li> <a href="#method=todo"><i class="glyphicon glyphicon-star"></i> 今日代办</a></li> <li><i class="glyphicon glyphicon-calendar"></i> 日历</li> </ul> <div if="{projects && projects.length > 0}">项目</div> <ul> <li each="{projects}"> <a href="#method=project&project={objectId}"><i class="glyphicon glyphicon-list"></i> {name}</a></li> </ul> <div>状态</div> <ul> <li> <a href="#method=finished"><i class="glyphicon glyphicon-ok"></i> 已完成</a></li> <li> <a href="#method=deleted"><i class="glyphicon glyphicon-trash"></i> 已删除</a></li> </ul>', function(opts) {
        var self = this;
        self.projects = [];
        self.updateMenu = function () {
            web.services.project.list(function (data) {
                if (data && data.data && data.data.results) {
                    self.projects = data.data.results;
                    self.update();
                }
            });
        };
        self.updateMenu();
        web.on('update', function () {
            self.updateMenu();
        });
    
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
riot.tag('register', '<div class="modal"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" onclick="{unmount}">&times;</span></button> <h4 class="modal-title">注册</h4> </div> <div class="modal-body"> <div class="form-group"> <label for="username">用户名：</label> <input type="text" class="form-control" name="username" id="username" placeholder="请输入用户名"> </div> <div class="form-group"> <label for="email">邮箱：</label> <input type="text" class="form-control" name="email" id="email" placeholder="请输入用户名"> </div> <div class="form-group"> <label for="password">密码：</label> <input type="password" class="form-control" id="password" name="password" placeholder="请输入密码"> </div> <div class="form-group"> <label for="password2">重复密码：</label> <input type="password" class="form-control" id="password2" name="password2" placeholder="请输入密码"> </div> </div> <div class="modal-footer"> <button type="submit" class="btn btn-primary" onclick="{login}">注册</button> <button type="button" class="btn btn-seconary">已有账号</button> </div> </div> </div> </div>', function(opts) {
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
riot.tag('todo_list', '<div each="{opts.results}"> <input type="checkbox" value="" onclick="{finish_todo}" todo_id="{objectId}" __checked="{finish}">{name} </div>', function(opts) {
        var self = this;
        console.log(self.opts);
        self.finish_todo = function (e) {
            var id = e.target.getAttribute('todo_id');
            var services = e.target.checked ? web.services.todo.finish : web.services.todo.unfinish;
            services(id,function(data){
                if (data && data.code == 0) {
                    web.message('操作成功！');
                    $(e.target).parent().remove();
                } else {
                    web.message((data && data.message) || '操作失败！');
                }
            });
        };
        web.on('new_todo', function (data) {
            if (data && data.objectId) {
                self.opts.results.unshift(data);
                self.update();
            } else {
                web.message('新任务内容为空！');
            }
        });
    
});

riot.tag('todo_new', '<input type="text" placeholder="新任务" onkeyup="{insert}">', function(opts) {
        var self = this;
        self.insert = function (e) {
            console.log(e.keyCode);
            if (e.keyCode == 13) {
                var val = e.target.value;
                web.services.todo.new({
                    name: val,
                    project: web._hashs.project,
                    pid: web._hashs.todo
                }, function (data) {
                    if (data && data.code == 0) {
                        web.message('添加新任务“' + val + '”成功！');
                        web.trigger('new_todo', data.data);
                        e.target.value = '';
                    } else {
                        web.message((data && data.message) || '添加新任务失败！');
                    }
                });
            }
        };
    
});
