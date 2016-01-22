module.exports = {
    // 转换data类型到Todo
    transfer: function (data) {
        return gl.transferData(data, {
            user: 'User',
            name: 'string', //任务名称
            detail: 'string', //任务详情
            finish: 'number', //完成时间
            begin: 'number', //开始时间
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
        d.user = d.user ? d.user : gl.user.myRef(req);
        d.begin = d.begin ? d.begin : Date.now();
        gl.newAndSave('Todo', d, res);
    },
    updatePid: function (id, callback) {

    },
    // todo列表 finished:bool,begin:number,finish:number,type: started,finished
    list: function (req, res) {
        var data = req.data;
        var sql = "select count(*),* from Todo where user = pointer('_User','" + req.session.user.objectId + "')";

        if (data.project) {
            sql += ' and project = pointer("Project","' + data.project + '")';
        }
        if (data.pid) {
            sql += ' and pid = pointer("Todo","' + data.pid + '")';
        }
        if (data.removed + '' == 'true') {
            // 已经删除的任务
            sql += ' and removed > 0';
        } else if (data.finished + '' == 'true') {
            // 已经完成的任务
            sql += ' and removed = 0 and finish >= 1 and finish < ' + Date.now();
        } else if (data.finished != 'all') {
            // 未完成的任务
            sql += ' and removed = 0 and ( finish = 0 or finish > ' + Date.now() + ')';
        } else {
            sql += ' and removed = 0 ';
        }

        // 某一个时间节点之间的任务
        if (data.begin && data.finish) {
        }
        else if (data.finish) {
        }
        if (data.order) {
            sql += ' order by ' + data.order;
        } else {
            sql += ' order by updatedAt desc';
        }
        gl.findAndSend(sql, res);
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