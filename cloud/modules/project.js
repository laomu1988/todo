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
        gl.newAndSave('Project', {
            name: data.name,
            user: gl.user.myRef(req)
        }, res);
    },
    // project列表
    list: function (req, res) {
        console.log('list project');
        var data = req.data;
        var sql = "select count(*),* from Project where user = pointer('_User','" + req.session.user.objectId + "')";

        if (data.removed + '' == 'true') {
            // 已经删除的项目
            sql += ' and removed = true';
        } else if (data.finished + '' == 'true') {
            // 已经完成的项目
            sql += ' and removed = false and finish is exists and finish != 0 and finish < ' + Date.now();
        } else if (data.finished != 'all') {
            // 未完成的项目
            sql += ' and removed = false';
            //sql += ' and removed = false and ( finish is not exists or finish = 0 or finish > ' + Date.now() + ')';
        }
        // 某一个时间节点之间的任务
        if (data.begin && data.finish) {
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
};