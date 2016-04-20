module.exports = {
    // 转换data类型到Todo
    transfer: function (data) {
        return gl.transferData(data, {
            user: 'User',
            name: 'string', //任务名称
            detail: 'string', //任务详情
            finish: 'number', //完成时间
            begin: 'number', //开始时间
            weight: 'number', // 排序权重
            project: 'Project', //所在项目
            pid: 'Todo',
            haschild: 'boolean',//是否包含子任务
            removed: 'boolean'//是否删除
        }, false);
    },
    get: function (req, res) {
        if (req.data.id) {
            gl.sendById('Todo', req.data.id, res);
        } else {
            gl.error(res, 400);
        }
    },
    new: function (req, res) {
        var data = req.data;
        var d = gl.todo.transfer(data);
        if (!d.name) {
            return gl.error(res, '任务名称不能为空！');
        }
        d.user = d.user ? d.user : gl.user.myRef(req);
        d.begin = d.begin ? d.begin : Date.now();
        d.weight = d.weight ? d.weight : d.begin;
        gl.newAndSave('Todo', d, res);
    },
    updateTodo: function (todo, callback) {
        // 更新数据： 子任务数目（已完成，未完成）,weight，根据父状态设置自己状态
        var id = todo.id, pid;
        var name = todo.get('name');

        // 更新weight
        if (!todo.get('weight')) {
            todo.set('weight', todo.get('begin'));
        }
        pid = todo.get('pid');
        if (pid && !todo.get('finished') && !todo.get('removed')) {
            todo.set('removed', pid.get('removed'));
            todo.set('finished', pid.get('finished'));
        }
        // 子任务数目 56a0bce58ac2470055f179a7
        gl.find('select count(*) from Todo where pid = pointer("Todo","' + id + '") and (removed is not exists or removed = 0)', function (data) {
            todo.set('children_num', data.count);
            save();
        });
        // 已完成的子任务数目
        gl.find('select count(*) from Todo where pid = pointer("Todo","' + id + '") and finish > 0  and (removed is not exists or removed = 0)', function (data) {
            todo.set('children_finish', data.count);
            save();
        });

        var sign = 0;

        function save() {
            sign += 1;
            if (sign >= 2) {
                todo.save().then(function () {
                    // 保存成功
                    console.log('save todo: ', name, 'children_num', todo.get('children_num'), 'children_finish', todo.get('children_finish'));
                    callback && callback(todo);
                }, function (error) {
                    // 失败
                    console.log(error);
                    callback && callback(null, error);
                });
            }
        }
    },
    updatePid: function (id, callback) {
        if (id) {
            gl.findById('Todo', id, function (todo) {
                gl.todo.updateTodo(todo);
            })
        }
    },
    // todo列表 finished:bool,begin:number,finish:number,type: started,finished
    list: function (req, res) {
        var data = req.data;
        var now = Date.now();
        var sql = "select include project,include pid,count(*),* from Todo where user = pointer('_User','" + req.session.user.objectId + "')";
        if (data.sign == 'today') {
            sql += ' and (project is not exists or project in (select * from Project where removed = 0 and (finish = 0 or finish > ' + now + ')))';
            sql += ' and pid is not exists';
        } else if (data.sign == 'timeline') {
            sql += ' and (project is not exists or project in (select * from Project where removed = 0)';
        }
        if (data.project) {
            // 查询项目任务
            sql += ' and project = pointer("Project","' + data.project + '")';
        }
        if (data.pid) {
            if (parseInt(data.pid)) {
                // 查询子任务
                gl.todo.updatePid(data.pid);
                sql += ' and pid = pointer("Todo","' + data.pid + '")';
            } else if (data.pid += 'false') {
                sql += ' and pid is not exists';
            }
        }

        if (data.removed + '' == 'true') {
            // 已经删除的任务
            sql += ' and removed > 0';
        } else {
            // 已经完成的任务
            sql += ' and removed = 0';
        }


        if (data.finished + '' == 'true') {
            sql += ' and finish >= 1 and finish < ' + now;
        } else if (data.finished + '' == 'false') {
            sql += ' and ( finish = 0 or finish > ' + now + ')';
        }

        // 某一个时间节点之间的任务
        if (data.begin && data.finish) {
            data.begin = parseInt(data.begin);
            data.finish = parseInt(data.finish);

            if (data.flag == 'begin') {
                // 这个时间段开始的任务
                sql += ' and begin >= ' + data.begin + ' and begin <= ' + data.finish;
            }
            else if (data.flag === 'finish') {
                // 这个时间段结束的任务
                sql += ' and finish >= ' + data.begin + ' and finish <= ' + data.finish;
            } else {
                // 任务经过这个时间段
                sql += ' and  begin <=' + data.finish + ' and (finish = 0 or finish >= ' + data.begin + ')';
            }
        }
        if (data.order) {
            sql += ' order by ' + data.order;
        } else {
            sql += ' order by weight, updatedAt desc';
        }
        gl.find(sql, function (data) {
            if (data && data.results && data.results.forEach) {
                data.results.forEach(function (result) {
                    var project = result.get('project');
                    if (project) {
                        result.set('project', project.toJSON());
                    }
                    var pid = result.get('pid');
                    if (pid) {
                        result.set('pid', pid.toJSON());
                    }
                });
            }
            res.json({code: 0, data: data});
        }, function (err) {
            res.json(err);
        });
    },
    // 修改信息 id:'',   name: '',project:''
    edit: function (req, res) {
        var data = req.data;
        var id = data.id;
        delete data.id;
        delete data.user;
        var data = gl.todo.transfer(data);
        // todo： 优化为update语句，只修改有权限的
        gl.editCondition('Todo', id, function (result) {
            if (result) {
                var user = result.get('user');
                if (user.id == req.session.user.objectId) {
                    return true;
                }
            }
            return false;
        }, data, res);
    },
    finish: function (req, res) {
        gl.editMyData('Todo', req.data.id, {finish: Date.now()}, req.session.user, res);
    },
    unfinish: function (req, res) {
        gl.editMyData('Todo', req.data.id, {finish: 0}, req.session.user, res);
    },
    remove: function (req, res) {
        gl.editMyData('Todo', req.data.id, {removed: Date.now()}, req.session.user, res);
    },
    unremove: function (req, res) {
        gl.editMyData('Todo', req.data.id, {removed: 0}, req.session.user, res);
    }
};