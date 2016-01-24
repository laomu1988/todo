var gl = global.gl;
module.exports = {
    // 转换data类型到Todo
    transfer: function (data) {
        return gl.transferData(data, {
            user: 'User',
            name: 'string', //名称
            detail: 'string', //详情
            finish: 'number', //完成时间
            begin: 'number', //开始时间
            removed: 'boolean',//是否删除
            group: 'Group',
            stage: 'Stage'
        }, false);
    },
    new: function (req, res) {
        var data = req.data;
        var d = gl.todo.transfer(data);
        if (!d.name) {
            return gl.error(res, '项目名称不能为空！');
        }
        d.user = d.user ? d.user : gl.user.myRef(req);
        d.begin = d.begin ? d.begin : Date.now();
        gl.newAndSave('Project', d, res);
    },
    get: function (req, res) {
        if (req.data.id) {
            gl.sendById('Project', req.data.id, res);
        } else {
            gl.error(res, 400);
        }
    },
    // project列表
    list: function (req, res) {
        console.log('list project');
        var data = req.data, now = Date.now();
        var sql = "select count(*),* from Project where user = pointer('_User','" + req.session.user.objectId + "')";


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

        // 某一个时间节点之间
        if (data.begin && data.finish) {
            data.begin = parseInt(data.begin);
            data.finish = parseInt(data.finish);
            sql += ' and  begin <=' + data.finish + ' and (finish = 0 or finish >= ' + data.begin + ')';
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
        if (!id) {
            return gl.error(res, 400);
        }
        delete data.id;
        delete data.user;
        var data = gl.project.transfer(data);
        gl.editCondition('Project', id, function (result) {
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
        gl.editMyData('Project', req.data.id, {finish: Date.now()}, req.session.user, res);
    },
    unfinish: function (req, res) {
        gl.editMyData('Project', req.data.id, {finish: 0}, req.session.user, res);
    },
    remove: function (req, res) {
        gl.editMyData('Project', req.data.id, {removed: Date.now()}, req.session.user, res);
    },
    unremove: function (req, res) {
        gl.editMyData('Project', req.data.id, {removed: 0}, req.session.user, res);
    }
};

