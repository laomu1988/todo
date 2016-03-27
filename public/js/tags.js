/** ----- created by gulp-riot-css -----*/
riot.tag('dialog', ' <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button> <h4 class="modal-title" id="mySmallModalLabel" if="{opts.data.title}">{opts.data.title}</h4> </div> <div class="modal-body">{opts.data.message} </div> <div class="modal-footer" if="{hasBtn}"> <button type="button" class="btn btn-seconary" if="{quit}" onclick="{quit}">取消</button> <button type="submit" class="btn btn-primary" onclick="{callback}">确定</button> </div> </div> </div> </div>', function(opts) {
        var self = this;
        self.hide = function () {
            $(self.root).find('.modal').modal('hide');
            if (typeof self.opts.data.quit == 'function' && !self.callback) {
                self.opts.data.quit();
            }
            setTimeout(self.unmount, 300);
        };
        var type = self.opts.data.type;
        if (type == 'alert' || type == 'confirm') {
            self.opts.tag = '';
            self.hasBtn = true;
            if (type == 'confirm') {
                self.quit = function () {
                    self.hide();
                }
            }
            self.callback = function () {
                self.hide();
                if (self.opts.data.callback) {
                    self.opts.data.callback();
                }
            }
        }

        self.on('mount', function () {
            if (self.opts.tag) {
                if (!self.opts.data) {
                    self.opts.data = {};
                }
                self.opts.data.hide = self.opts.data.hide || self.hide;
                var tag = $(self.root).find('.modal-body')[0];
                riot.mount(tag, opts.tag, opts.data);
            }
            $(self.root).find('.modal').modal();
        });
    
});
riot.tag('edit_project', '<div class="name"> <input type="text" name="name" placeholder="名称" value="{opts.data.name}"> </div> <div> <textarea type="text" name="detail" placeholder="详情">{opts.data.detail}</textarea> </div> <div class="">时间，状态</div> <div class="bottom"> <div class="btn btn-cancel" onclick="{cancel}">取消</div> <div class="btn btn-primary" onclick="{submit}">确定</div> </div>', '[riot-tag=edit_project] .name,edit_project .name{ margin-bottom: 10px;} [riot-tag=edit_project] .bottom,edit_project .bottom{ text-align: right;}', function(opts) {
        var self = this;
        self.isEdit = !!self.opts.data && !!self.opts.data.objectId;
        self.children = [];
        self.cancel = function () {
            if (self.opts.hide) {
                self.opts.hide();
            }
            self.unmount();
        };
        self.submit = function () {
            var data = {
                name: self.name.value,
                detail: self.detail.value
            };
            var server = web.services.project, action = '新建';
            if (!server) {
                web.message('未知操作');
                return self.cancel();
            }
            if (self.opts.data && self.opts.data.objectId) {
                data.id = self.opts.data.objectId;
                server = server.edit;
                action = '修改';
            } else {
                server = server.new;
            }
            server(data, function (data) {
                if (data && data.code == 0) {
                    web.message(action + '成功！');
                    self.cancel();
                    history.go(0);
                } else {
                    web.errmsg(data, action + '失败！');
                }
            });
        }
    
});
riot.tag('edit_todo', '<div class="name"> <input type="text" name="name" placeholder="任务名称" value="{opts.data.name}"> </div> <div> <textarea type="text" name="detail" placeholder="任务详情">{opts.data.detail}</textarea> </div> <div class="name">子任务：</div> <div class="children" if="{opts.data.name}"> <div each="{children}" class="child"> <input type="checkbox" value="" keep="true" onclick="{web.finish}" o_type="todo" o_id="{objectId}" __checked="{finish < now && finish != 0}"> <div class="child-input"> <input type="text" value="{name}" o_id="{objectId}" o_type="todo" onkeyup="{keyup}"> </div> <div class="buttons"> <div class="button" onclick="{deleteTodo}" o_id="{objectId}"><i class="glyphicon glyphicon-trash"></i></div> </div> </div> <div> <input type="text" value="" placeholder="输入后回车添加子任务" onkeyup="{keyup}"> </div> </div> <div class="">子任务，时间，状态</div> <div class="bottom"> <div class="btn btn-cancel" onclick="{cancel}">取消</div> <div class="btn btn-primary" onclick="{submit}">确定</div> </div>', '[riot-tag=edit_todo] .name,edit_todo .name{ margin-bottom: 10px;} [riot-tag=edit_todo] .bottom,edit_todo .bottom{ text-align: right;} [riot-tag=edit_todo] .children input[type=checkbox],edit_todo .children input[type=checkbox]{ float: left;} [riot-tag=edit_todo] .children .child-input,edit_todo .children .child-input{ margin-left: 20px;} [riot-tag=edit_todo] .children .child-input input,edit_todo .children .child-input input{ border: 0; line-height: 26px; height: 26px;} [riot-tag=edit_todo] .child,edit_todo .child{ position: relative;} [riot-tag=edit_todo] .buttons,edit_todo .buttons{ position: absolute; right: 14px; top: 0;}', function(opts) {
        var self = this;
        self.data = self.opts.data;
        self.isEdit = !!self.opts.data && !!self.opts.data.objectId;
        self.now = Date.now();
        if (self.isEdit) {
            self.id = self.opts.data.objectId;
        }
        self.children = [];
        if (self.isEdit) {
            web.services.todo.list({pid: self.id}, function (result) {
                if (result && result.code == 0 && result.data) {
                    self.children = self.children.concat(result.data.results);
                    self.update();
                }
            });
        }


        self.cancel = function () {
            if (self.opts.hide) {
                self.opts.hide();
            }
            self.unmount();
        };
        self.submit = function () {
            var data = {
                name: self.name.value,
                detail: self.detail.value
            };
            var server = web.services.todo, action = '新建';
            if (self.isEdit) {
                data.id = self.id;
                server = server.edit;
                action = '修改';
            } else {
                server = server.new;
            }
            server(data, function (data) {
                if (data && data.code == 0) {
                    web.message(action + '成功！');
                    self.cancel();
                    history.go(0);
                } else {
                    web.errmsg(data, action + '失败！');
                }
            });
        };
        self.keyup = function (e) {
            if (e && e.keyCode == 13) {
                var value = e.target.value, id = e.target.getAttribute('o_id');
                if (value) {
                    if (!id) {
                        console.log('新建子任务：', value);
                        web.services.todo.new({
                            name: value,
                            pid: self.id,
                            project: self.data.project.objectId
                        }, function (result) {
                            if (result && result.code == 0) {
                                web.message('新建子任务成功!');
                                e.target.value = '';
                                self.children.push(result.data);
                                self.update();
                            } else {
                                web.errmsg(result, '新建子任务失败！');
                            }
                        });
                    } else {
                        web.services.todo.edit({
                            name: value,
                            id: id,
                            project: self.data.project.objectId
                        }, function (result) {
                            if (result && result.code == 0) {
                                web.message('修改任务成功！');
                            } else {
                                web.errmsg(result, '修改任务失败！');
                            }
                        });
                    }
                }
                else if (id) {
                    self.deleteTodo(id);
                }
                else {
                    web.message('不能为空！');
                }
            }
        }
        self.deleteTodo = function(e){
            var id = e;
            if(e && e.target){
                id = e.target.getAttribute('o_id');
            }
            if(!id){
                return false;
            }
            web.confirm('删除后不能恢复，你确定要删除子任务吗?', function (data) {
                web.services.todo.remove(id, function (result) {
                    if (result && result.code == 0) {
                        for (var i = 0; i < self.children.length; i++) {
                            if (self.children[i].objectId == id) {
                                self.children.splice(i, 1);
                                self.update();
                                web.message('删除成功！');
                                return;
                            }
                        }
                    } else {
                        web.message((result && result.message) || '删除失败！');
                    }
                })
            });
        }
    
});
riot.tag('header', '<a href="javascript:void(0)" onclick="{home}" class="home"><i class="glyphicon glyphicon-home"></i> <span>Todo</span></a> <a href="javascript:void(0)" onclick="{menu}" class="menu"><i class="glyphicon glyphicon-menu-hamburger"></i> <span>Todo</span></a> <a href="javascript:void(0)" class="pull-right" onclick="{login}" if="{!isLogin}"> <i class="glyphicon glyphicon-log-in"></i> <span>登录</span> </a> <a href="javascript:void(0)" class="pull-right" onclick="{register}" if="{!isLogin}"> <i class="glyphicon glyphicon-expand"></i> <span>注册</span> </a> <a href="javascript:void(0)" class="pull-right" if="{isLogin}" onclick="{logout}"> <i class="glyphicon glyphicon-log-out"></i> <span>退出</span> </a> <a if="{user && user.username}" href="javascript:void(0)" class="pull-right"> <i class="glyphicon glyphicon-user"></i> {user.username} </a>', function(opts) {
        var self = this;
        self.home = function () {
            location.herf = '#';
        };
        self.menu = function () {
            $('.main-box > menu').addClass('show');
        };
        $('body').click(function (e) {
            if ($(e.target).parent('.menu').length == 0) {
                $('.main-box > menu').removeClass('show');
            }
        });
        self.login = function () {
            web.mount('login');
        };
        self.logout = function () {
            web.services.user.logout(function () {
                self.user = web.getUser();
                self.isLogin = !!self.user;
                self.update();
                web.trigger('update');
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
riot.tag('index', ' <div class="main"> <h1>Todo任务列表</h1> <h2>使用技术：</h2> <ul> <li>riot框架,bootstrap</li> <li>Nodejs,express</li> <li>avoscloud中数据库</li> </ul> <h2>总体功能：</h2> <ul> <li>项目管理</li> <li>任务管理</li> <li>用户管理</li> <li>笔记管理</li> </ul> <h2>当前功能：</h2> <ul> <li>用户管理： 用户注册及登录</li> <li>项目管理：新建、修改、删除项目</li> <li>任务管理：新建、修改、删除任务、子任务管理</li> </ul> <h2>Todo：</h2> <ul> <li>用户管理：用户修改信息，找回密码</li> <li>任务管理：子任务数目，任务状态</li> <li>笔记管理：新建、修改、删除笔记、按照时间曲线学习笔记</li> </ul> </div>', '[riot-tag=index] .main,index .main{ padding: 0 50px 40px; margin: 0;}', function(opts) {


});
riot.tag('loading', '<div class="loading"><i class="fa fa-spinner fa-pulse"></i></div>', function(opts) {

});
riot.tag('login', '<div class="modal"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" onclick="{unmount}">&times;</span></button> <h4 class="modal-title">用户登录(<a href="javascript:void(0)" onclick="{register}">还没有账号，点击注册</a>) </h4> </div> <div class="modal-body"> <div class="form-group"> <label for="username">用户：</label> <input type="text" class="form-control" name="username" id="username" placeholder="请输入用户名"> </div> <div class="form-group"> <label for="password">密码：</label> <input type="password" class="form-control" id="password" name="password" placeholder="请输入密码"> </div> </div> <div class="modal-footer"> <button type="submit" class="btn btn-primary" onclick="{login}">登录</button> <button type="button" class="btn btn-seconary">忘记密码</button> </div> </div> </div> </div>', function(opts) {
        var self = this;
        self.login = function () {
            var form = $(self.root);
            web.formSubmit(form, {
                services: web.services.user.login,
                callback: function (data) {
                    if (data && data.code == 0 && data.data.username) {
                        web.setCookie('user', data.data);
                        web.message('登录成功！');
                        $(self.root).find('.modal').modal('hide');
                        self.unmount();
                        web.trigger('update');
                    }
                }
            });
        };
        self.register = function () {
            $(self.root).find('.modal').modal('hide');
            self.unmount();
            web.mount('register');
        };
        self.on('mount', function () {
            $(self.root).find('.modal').modal();
            $(self.root).find('#username').focus();
        })
    
});
riot.tag('main', '<menu></menu> <div class="main"> <div class="loading"><i class="fa fa-spinner fa-pulse"></i></div> <view></view> </div>', function(opts) {

    
});
riot.tag('menu', ' <div class="type">新建</div> <ul> <li><a href="javascript:void(0)" onclick="{web.new_todo}"><i class="glyphicon glyphicon-plus"></i> 新任务</a></li> <li><a href="javascript:void(0)" onclick="{web.new_project}"><i class="glyphicon glyphicon-list-alt"></i> 新项目</a></li>  </ul> <div class="type">查看</div> <ul> <li> <a href="#method=today" class="{active: method == \'todo\'}"><i class="glyphicon glyphicon-star"></i> 今日待办</a> </li> <li> <a href="#method=timeline"><i class="glyphicon glyphicon-calendar"></i> 日历</a></li> </ul> <div if="{projects && projects.length > 0}" class="type">项目</div> <ul> <li each="{projects}"> <a href="#method=project&project={objectId}" ondragover="{web.ondragover}" ondrop="{web.ondrop}" method="project" class="{active: method == \'project\' && web._hashs.project == objectId}" ondragstart="{web.ondrag}" draggable="true" o_type="project" o_id="{objectId}"><i class="glyphicon glyphicon-list"></i> {name}</a></li> </ul> <div class="type">状态</div> <ul> <li> <a href="#method=finished" ondragover="{web.ondragover}" ondrop="{web.ondrop}" method="finished" class="{active: method == \'finished\'}"><i class="glyphicon glyphicon-ok"></i> 已完成</a></li> <li> <a href="#method=removed" ondragover="{web.ondragover}" ondrop="{web.ondrop}" method="removed" class="{active: method == \'removed\'}"><i class="glyphicon glyphicon-trash"></i> 已删除</a></li> </ul>', function(opts) {
        var self = this;
        self.method = web._hashs.method || 'todo';
        self.projects = [];
        self.updateMenu = function () {
            if (!web.getCookie('user', 'json')) {
                return;
            }
            self.method = web._hashs.method || 'todo';
            web.services.project.list({finished: false, removed: false}, function (data) {
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
        riot.route(self.updateMenu);
    
});
riot.tag('project-list', '<div each="{opts.list}" o_type="todo" o_id="{objectId}" draggable="true" ondragstart="{web.ondrag}" ondrop="{web.ondrop}" method="todo" name="{name}" class="todo"> <input type="checkbox" value="" onclick="{web.finish}" o_type="project" o_id="{objectId}" __checked="{finish < now && finish != 0}" if="{!removed}"> <i class="glyphicon glyphicon-list"></i> <span class="btn btn-warning btn-xs" o_type="project" o_id="{objectId}" onclick="{web.unremove}" if="{removed}">取消删除</span> <a href="#method=project&project={objectId}" o_type="project" o_id="{objectId}" ondragover="{web.ondragover}" class="{\'removed\':removed}">{name}</a> </div>', '[riot-tag=project-list] .todo,project-list .todo{ border-bottom: 1px solid #ccc; border-left: 5px solid #ccc; padding-left: 5px; margin-top: 5px;} [riot-tag=project-list] .todo:hover,project-list .todo:hover{ background: #e8e8e8;} [riot-tag=project-list] .project,project-list .project, [riot-tag=project-list] .pid,project-list .pid{ background: #666; color: #fff; padding: 3px 4px; border-radius: 3px;} [riot-tag=project-list] .pid,project-list .pid{ background: #ADADAD;}', function(opts) {
        var self = this;
        self.now = Date.now();
        web.on('new_todo', function (data) {
            if (data && data.objectId) {
                self.opts.list.unshift(data);
                self.update();
            } else {
                web.message('新任务内容为空！');
            }
        });
    
});
riot.tag('register', '<div class="modal"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" onclick="{unmount}">&times;</span></button> <h4 class="modal-title">注册(<a href="javascript:void(0)" onclick="{login}">已有账号，点击登录</a>)</h4> </div> <div class="modal-body"> <div class="form-group"> <label for="username">用户名：</label> <input type="text" class="form-control" name="username" id="username" placeholder="请输入用户名"> </div> <div class="form-group"> <label for="email">邮箱：</label> <input type="text" class="form-control" name="email" id="email" placeholder="请输入用户名"> </div> <div class="form-group"> <label for="password">密码：</label> <input type="password" class="form-control" id="password" name="password" placeholder="请输入密码"> </div> <div class="form-group"> <label for="password2">重复密码：</label> <input type="password" class="form-control" id="password2" name="password2" placeholder="请输入密码"> </div> </div> <div class="modal-footer"> <button type="button" class="btn btn-seconary" onclick="{cancel}">取消</button> <button type="submit" class="btn btn-primary" onclick="{register}">注册</button> </div> </div> </div> </div>', function(opts) {
        var self = this;
        self.register = function () {
            var form = $(self.root);
            web.formSubmit(form, {
                services: web.services.user.register,
                callback: function (data) {
                    if (data && data.code == 0) {
                        web.alert('注册成功，请到邮箱查看并激活账号！');
                        web.setCookie('user', data.data);
                        self.cancel();
                        web.trigger('update');
                    }
                }
            });
        };
        self.cancel = function () {
            $(self.root).find('.modal').modal('hide');
            self.unmount();
        };
        self.login = function () {
            self.cancel();
            web.mount('login');
        };
        self.on('mount', function () {
            $(self.root).find('.modal').modal();
        })
    
});
riot.tag('timeline', ' <div class="timeline"> <span onclick="{prev}">上一周</span>时间统计表<span onclick="{next}">下一周</span> </div> <div class="week"> <span>日</span> <span>一</span> <span>二</span> <span>三</span> <span>四</span> <span>五</span> <span>六</span> </div> <div class="list" ondragover="{web.ondragover}" ondrop="{ondrop}" riot-style="height:{maxTop * 21 + 23}px;"> <div class="todo" each="{list}" riot-style="{style}" title="{name}" finished="{finished}"> <span class="start"></span> <span class="one-line" left="{left}" right="{right}" width="{width}" draggable="true" ondragstart="{web.ondrag}" o_id="{objectId}" o_type="todo">{name}{last}-{ori}-{width}</span> <span class="end"></span> </div> </div>', '[riot-tag=timeline] .list,timeline .list{ position: relative; background: -webkit-linear-gradient(left, #999 1px, transparent 2px, transparent 200px), -webkit-linear-gradient(top, #ccc 1px, transparent 2px, transparent 21px); background-size: 14.28% 21px; border-top: 1px solid #ccc;} [riot-tag=timeline] .todo,timeline .todo{ font-size: 13px; height: 20px; line-height: 20px; background: #129FEA; color: #fff; border-radius: 3px; padding: 0 15px; margin-top: 1px; position: absolute; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;} [riot-tag=timeline] .todo[finished=false],timeline .todo[finished=false]{ background: #cc3747;} [riot-tag=timeline] .todo .one-line,timeline .todo .one-line{ display: inline-block; max-width: 100%;} [riot-tag=timeline] .start,timeline .start, [riot-tag=timeline] .end,timeline .end{ background: greenyellow; border-radius: 10px; height: 16px; width: 16px; position: absolute; left: -9px; top: 2px; display: none;} [riot-tag=timeline] .todo:hover,timeline .todo:hover{ z-index: 1;} [riot-tag=timeline] .todo:hover .start,timeline .todo:hover .start, [riot-tag=timeline] .todo:hover .end,timeline .todo:hover .end{ display: inline-block;} [riot-tag=timeline] .end,timeline .end{ left: auto; right: -10px;}', function(opts) {
        var self = this;
        var len = 24 * 60 * 60 * 1000 * 7;
        var sign = web._hashs.sign || 'week';
        self.date = parseInt(web._hashs.date) || Date.now();
        self.now = Date.now();
        var date = web.getWeekRange(self.date);

        date.order = 'begin,finish';
        self.begin = date.begin;
        self.finish = date.finish;
        self.len = self.finish - self.begin;
        self.blockNum = 7;
        self.block = self.len / self.blockNum; //每一块代表的时间刻度
        self.blockWidth = 100 / self.blockNum; // 每一块的宽度
        self.placed = [];// 记录每一行的宽度

        web.services.todo.list(date, function (data) {
            if (data && data.code == 0 && data.data) {
                self.list = data.data.results;
                if (self.list.forEach) {
                    self.list.forEach(self.updateTodo);
                }
                self.update();
            }
        });
        self.maxTop = 0;
        self.updateTodo = function (todo) {
            todo.finished = todo.finish > 0 && todo.finish < web.now; // 是否完成
            todo.beginNum = todo.begin > self.begin ? Math.floor((todo.begin - self.begin + self.block - 1) / self.block) : 0;
            todo.finishNum = todo.finish > 0 ? Math.floor(( todo.finish - self.begin + self.block - 1) / self.block) : self.blockNum;
            if (self.finishNum >= self.blockNum) {
                self.finishNum = self.blockNum - 1;
            }
            todo.left = (todo.beginNum * self.blockWidth).toFixed(2);
            todo.width = ((todo.finishNum - todo.beginNum + 1) * self.blockWidth).toFixed(2);
            for (var line = 0; ; line++) {

                if (!self.placed[line]) {
                    self.placed[line] = [];
                }
                var place = self.placed[line];
                var placed = false;
                for (var row = todo.beginNum; row <= todo.finishNum; row++) {
                    if (place[row]) {

                        placed = true;
                        break;
                    }
                }
                if (!placed) {

                    for (var row = todo.beginNum; row <= todo.finishNum; row++) {
                        place[row] = true;
                    }
                    todo.top = line;
                    if (line > self.maxTop) {
                        self.maxTop = line;
                    }
                    break;
                }
            }
            todo.style = 'top:' + (todo.top * 21) + 'px;left: ' + todo.left + '%;width: ' + todo.width + '%';

            
        };
        self.prev = function () {
            location.href = '#method=timeline&sign=w&date=' + (self.date - len);
        };

        self.next = function () {
            location.href = '#method=timeline&sign=w&date=' + (self.date + len);
        };

        self.ondrop = function (e) {
            var blockWidth = $(e.target).width() / self.blockNum;
            var nowPlace = Math.floor(e.offsetX / blockWidth);
            var drag = web._drag;
            var todo = web._todos[drag.getAttribute('o_id')];
            if (todo) {
                var add = (nowPlace - todo.beginNum) * self.block;

                todo.begin += add;
                if (todo.finish) {
                    todo.finish += add;
                }
                console.log({
                    id: todo.objectId,
                    begin: todo.begin + add,
                    finish: todo.finish > 0 ? todo.finish + add : 0
                });
                todo.beginNum = nowPlace;
                web.message('修改成功！');
                $(drag).parent().css('left', todo.beginNum * self.blockWidth + '%');

                return;
                web.services.todo.edit({
                    id: todo.objectId,
                    begin: todo.begin + add,
                    finish: todo.finish > 0 ? todo.finish + add : 0
                }, function (data) {
                    if (data && data.code == 0) {
                        todo.beginNum = nowPlace;
                        web.message('修改成功！');
                        $(drag).parent().css('left', todo.beginNum * self.blockWidth + '%');
                    } else {
                        web.message('修改失败！');
                    }
                });
            }
        }
    
});
riot.tag('today', '', function(opts) {


});
riot.tag('todo_list', ' <div each="{opts.list}" o_type="todo" o_id="{objectId}" method="todo" weight="{prevWeight}" draggable="true" ondragstart="{web.ondrag}" ondrop="{web.ondrop}" ondragover="{web.ondragover}" dragover_class="dragover" ondragleave="{web.ondragleave}" name="{name}" class="todo"> <input type="checkbox" value="" onclick="{web.finish}" o_type="todo" o_id="{objectId}" __checked="{finish < now && finish != 0}" if="{!removed}" prevent="true"> <span class="btn btn-warning btn-xs" o_type="todo" o_id="{objectId}" onclick="{web.unremove}" if="{removed}">取消删除</span> <a if="{web._hashs.method !== \'project\' && project && project.name }" href="#method=project&project={project.objectId}" class="project">[{project.name}]</a> <a if="{pid&& pid.name}" href="javascript:void(0)" class="pid" onclick="{web.edit}" o_id="{pid.objectId}" o_type="todo">[{pid.name}]</a> <span onclick="{web.edit}" o_type="todo" o_id="{objectId}" class="{\'removed\':removed}">{name}</span> <span if="{children_num > 0}">[{children_finish}/{children_num}]</span> </div> <div o_type="todo" weight="{minWeight-1}" method="todo" class="todo space" ondrop="{web.ondrop}" ondragover="{web.ondragover}" dragover_class="dragover" ondragleave="{web.ondragleave}"></div>', '[riot-tag=todo_list] .todo,todo_list .todo{ border-bottom: 1px solid #ccc; border-left: 5px solid #ccc; padding-left: 5px; margin-top: 5px; min-height: 26px;} [riot-tag=todo_list] .todo.space,todo_list .todo.space{ border: 0;} [riot-tag=todo_list] .todo:hover,todo_list .todo:hover{ background: #e8e8e8;} [riot-tag=todo_list] .project,todo_list .project, [riot-tag=todo_list] .pid,todo_list .pid{ background: #666; color: #fff; padding: 3px 4px; border-radius: 3px;} [riot-tag=todo_list] .pid,todo_list .pid{ background: #ADADAD;} [riot-tag=todo_list] .dragover,todo_list .dragover{ border-top: 26px #ccc solid !important;}', function(opts) {
        var self = this;
        self.now = Date.now();
        self.minWeight = 9999999999999, self.maxWeight = 0;
        self.updateData = function () {
            var list = self.opts.list;
            var len = list.length;
            for (var i = 0; i < list.length; i++) {
                var weight = list[i].weight = parseFloat(list[i].weight || list[i].begin);
                weight > self.maxWeight && (self.maxWeight = weight);
                weight < self.minWeight && (self.minWeight = weight);
            }
            list.sort(function (a, b) {
                return b.weight - a.weight;
            });
            for (var i = 0; i < len; i++) {
                list[i].prevWeight = i == 0 ? list[i].weight + 0.5 : (list[i].weight + list[i - 1].weight) / 2;
                console.log(list[i].name, list[i].weight);
            }
        };
        web.on('new_todo', function (data) {
            if (data && data.objectId) {
                self.opts.list.unshift(data);
                self.update();
            } else {
                web.message('新任务内容为空！');
            }
        });
        web.on('finish unfinish', function (type, tid) {
            var list = self.opts.list;
            for (var i = 0; i < list.length; i++) {
                if (list[i].objectId == tid) {
                    list.splice(i, 1);
                    self.update();
                    return;
                }
            }
        });
        self.updateData();
        web.on('change-weight', function (type, data) {
            self.updateData();
            self.update();
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
                        e.target.value = '';
                        web.trigger('new_todo', data.data);
                    } else {
                        web.message((data && data.message) || '添加新任务失败！');
                    }
                });
            }
        };
    
});
riot.tag('view-finished', ' <div class="name">已完成项目</div> <div riot-tag="view" server="{web.services.project.list}" tag="project-list" data="{data}" field="list" server-data="data.results"></div> <div class="name">已完成任务</div> <div riot-tag="view" server="{web.services.todo.list}" tag="todo_list" data="{data}" field="list" server-data="data.results"></div>', function(opts) {
        var self = this;
        self.data = {
            finished: true,
            order: 'finish desc'
        }
    
});

riot.tag('view-removed', ' <div class="name">已删除项目</div> <div riot-tag="view" server="{web.services.project.list}" tag="project-list" data="{data}" field="list" server-data="data.results"></div> <div class="name">已删除任务</div> <div riot-tag="view" server="{web.services.todo.list}" tag="todo_list" data="{data}" field="list" server-data="data.results"></div>', function(opts) {
        var self = this;
        self.data = {
            removed: true,
            order: 'removed desc'
        }
    
});

riot.tag('view', ' <div class="riot"> <div riot-tag="loading" if="{!error}"></div> </div>', function(opts) {
        var self = this, server = self.opts.server, tag = self.opts.tag, field = self.opts.field || 'data', server_data = self.opts['server-data'] || '';
        if (server && tag) {
            server(self.opts.data, function (result) {
                if (result && result.code == 0) {
                    if (server_data) {
                        var flag = server_data.indexOf('.');
                        while (flag >= 0) {
                            var temp = server_data.substr(0, flag);
                            server_data = server_data.substr(flag + 1);
                            result = result[temp];
                            if (!result) {
                                self.error = true;
                            }
                            flag = server_data.indexOf('.');
                        }
                        if (server_data) {
                            result = result[server_data];
                        }
                    }
                    if (result && !self.error) {
                        var data = {};
                        data[field] = result;
                        riot.mount(self.root.querySelector('.riot'), tag, data);
                    }
                } else {

                }
            })
        } else {
            self.error = true;
        }
    
});
riot.tag('view_detail', '<div if="{opts.objectId}"> <div class="name {\'removed\': project.removed}" o_type="project" o_id="{opts.objectId}" draggable="true" ondragstart="{web.ondrag}"> <input type="checkbox" value="" onclick="{web.finish}" o_type="project" o_id="{opts.objectId}" __checked="{opts.finish > 0 && opts.finish > 0}"> <span onclick="{web.edit}" o_id="{opts.objectId}" o_type="project">{project.name}</span> </div> <div class="detail" onclick="{web.edit}" o_id="{opts.objectId}" o_type="project"> {opts.detail} </div> </div> <div riot-tag="todo_new" o-id="" o-type=""></div> <div class="list"> <loading></loading> </div>', '[riot-tag=view_detail] .name,view_detail .name{ font-weight: 700; padding: 14px 0 5px 0px; font-size: 18px;} [riot-tag=view_detail] .detail,view_detail .detail{ margin-left: 23px; color: #666; margin-bottom: 20px;}', function(opts) {
        var self = this;
        self.now = Date.now();
        console.log(self.opts);
        if (web._hashs.method == 'project') {
            web.services.project.get(web._hashs.project, function (data) {
                if (data && data.code == 0 && data.data) {
                    self.project = data.data;
                    self.update();
                }
            })
        }
        web.services.todo.list({project: web._hashs.project, finished: false, pid: false}, function (result) {
            if (result && result.code == 0 && result.data) {
                self.list = result.data.results;
                riot.mount(self.root.querySelector('.list'), 'todo_list', {list: self.list});
                self.update();
            }
        });
    
});
riot.tag('view_list', '<todo_new></todo_new> <div riot-tag="todo_list" list="{list}" detail="true"></div>', function(opts) {
        var self = this;
        self.list = self.opts.results;
    
});
