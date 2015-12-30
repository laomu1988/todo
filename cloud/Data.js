/**将AV对象包裹在此*/
var classes = {};

function send(success, error, res) {
    return {
        success: function (data) {
            console.log('发送数据')
            if (typeof success == 'function') {
                success(data);
            }
            res.json({code: 0, data: data});
        },
        error: function (data, err) {
            if (typeof error == 'function') {
                error(err, data);
            }
            res.json(err || data);
        }
    }
}

var gl = {
    req: null,
    res: null,
    next: null,
    nowStr: function () {
        return (new Date()).toISOString();
    }
};


var methods = {
    gl: gl,
    clearData: function (data) {
        return JSON.parse(JSON.stringify(data));
    },
    find: function (sql, success, error) {
        AV.Query.doCloudQuery(sql, {success: success, error: error});
    },
    findAndSend: function (sql, res) {
        console.log('sql: ', sql);
        methods.find(sql, function (result) {
            res.json({code: 0, data: result});
        }, function (err) {
            res.json(err);
        });
    },
    findById: function (className, objectId, success, error) {
        console.log('findById', className, objectId, success, error);
        var query = new AV.Query(methods.class(className));
        query.get(objectId, {
            success: success,
            error: error
        });
    },
    class: function (className) {
        if (!classes[className]) {
            return classes[className] = AV.Object.extend(className);
        }
        return classes[className];
    },
    new: function (className, data) {
        if (!classes[className]) {
            classes[className] = AV.Object.extend(className);
            console.log('新类型', className);
        }
        var d = new classes[className];
        if (data) {
            for (var attr in data) {
                if (attr.indexOf('__') >= 0) {
                    continue;
                }
                d.set(attr, data[attr]);
            }
        }
        return d;
    },
    newAndSave: function (className, data, res) {
        console.log('newAndSave', JSON.stringify(data));
        var d = methods.new(className, data);
        d.save(null, send(null, null, res));
    },
    withId: function (className, objectId) {
        var obj = methods.new(className);
        obj.id = objectId;
        return obj;
    },
    editWithId: function (className, objectId, data, res) {
        var post = AV.Object.createWithoutData(className, objectId);
        for (var attr in data) {
            post.set(attr, data[attr]);
        }
        post.save(null, send(null, null, res));
    },
    /**查找对象，并根据条件函数返回结果确定是否修改值
     * className: 类
     * objectId： 对象id
     * conditionFunc： 条件函数，假如返回true，则修改查询结果
     * data： 要修改的值
     * */
    editCondition: function (className, objectId, conditionFunc, data, res) {
        console.log('editCondition');
        methods.findById(className, objectId, function (result) {
            console.log('查询到结果：', JSON.stringify(result));
            if (conditionFunc(result)) {
                for (var attr in data) {
                    result.set(attr, data[attr]);
                }
                result.save(null, send(null, null, res));
            } else {
                res.json({code: 1, message: '没有权限进行该操作！'});
            }
        }, function (err) {
            console.log('查询出错！');
            res.json(err);
        });
    },
    extend: function () {
        var ret = {};
        for (var i = 0; i < arguments.length; i++) {
            var val = arguments[i];
            for (var attr in val) {
                if (attr.indexOf('__') >= 0) {
                    continue;
                }
                ret[attr] = val;
            }
        }
        return ret;
    },
    // 权限
    right: {
        needLogin: function (req, res, next) {
            // console.log('session.user', req.session.user);
            if (methods.user.isLogin(req)) {
                return next();
            }
            res.json({code: 1, message: '你还未登录'});
        },
        needAdmin: function (req, res, next) {
            if (methods.user.isAdmin()) {
                return next();
            }
            res.json({code: 1, message: '没有权限！'});
        }
    },
    user: {
        new: function (req, res) {
            var d = methods.new('User', data);
            d.signUp(null, send(null, null, res));
        },
        login: function (req, res) {
            var data = req.data;
            console.log('用户尝试登录：', data.username);
            AV.User.logIn(data.username, data.password, send(function (data) {
                data = JSON.parse(JSON.stringify(data));
                console.log('用户登录成功：', data.username);
                req.session.user = data;
            }, null, res))
        }
        ,
        isLogin: function (req) {
            var user = req.session.user;
            if (user && user.objectId) {
                console.log('已经登陆');
                return true;
            }
            console.log('还未登录');
            return null;
        }
        ,
        isAdmin: function () {

        }
        ,
        myRef: function () {
            console.log('myRef:', gl.req.session.user.objectId);
            return methods.withId('User', gl.req.session.user.objectId);
        }
        ,
        myInfo: function () {
            return gl.req.session.user;
        }
        ,
        logout: function (res) {

        }
    },
    todo: {
        // 转换data类型到Todo
        transfer: function (data) {
            return methods.transferData(data, {
                user: 'User',
                name: 'string', //任务名称
                detail: 'string', //任务详情
                finish: 'number', //完成时间
                begin: 'number', //开始时间
                project: 'Project', //所在项目
                haschild: 'boolean',//是否包含子任务
                removed: 'boolean'//是否删除
            }, false);
        },
        new: function (req, res) {
            var data = req.data;
            var d = methods.todo.transfer(data);
            d.user = d.user ? d.user : methods.user.myRef();
            d.begin = d.begin ? d.begin : Date.now();
            if (d.Project) {

            }
            methods.newAndSave('Todo', d, res);
        },
        // todo列表 finished:bool,begin:number,finish:number,type: started,finished
        list: function (req, res) {
            var data = req.data;
            var sql = "select count(*),* from Todo where user = pointer('_User','" + req.session.user.objectId + "')";

            if (data.project) {
                sql += ' and project = pointer("Project","' + data.project + '")';
            }

            if (data.finished + '' == 'true') {
                sql += ' and finish is exists and finish < ' + Date.now();
            } else if (data.finished + '' == 'false') {
                sql += ' and ( finish is not exists or finish > ' + Date.now() + ')';
            }
            // 某一个时间节点之间的任务
            if (data.begin && data.finish) {
            }
            else if (data.finish) {
            }
            // sql += ' order by updateAt desc';
            methods.findAndSend(sql, res);
        }
        ,
        // 修改信息 id:'',   name: '',project:''
        edit: function (req, res) {
            var data = req.data;
            var id = data.id;
            delete data.id;
            delete data.user;
            var data = methods.todo.transfer(data);
            // todo： 优化为update语句，只修改有权限的
            methods.editCondition('Todo', id, function (result) {
                if (result) {
                    var user = result.get('user');
                    if (user.id == req.session.user.objectId) {
                        return true;
                    }
                }
                return false;
            }, data, res);
        }
    },
    /**转换数据类型*/
    transferData: function (data, typeArray, keep) {
        var d = {};
        for (var attr in data) {
            switch (typeArray[attr]) {
                case 'date':
                    d[attr] = new Date(data[attr]);
                    break;
                case 'bool':
                case 'boolean':
                    d[attr] = data[attr] + '' == 'true';
                    break;
                case 'number':
                    d[attr] = parseFloat(data[attr]);
                    break;
                case 'string':
                    d[attr] = data[attr] + '';
                    break;
                case 'Project':
                case 'User':
                    d[attr] = methods.withId(typeArray[attr], data[attr]);
                    break;
                default:
                    if (keep !== false) {
                        d[attr] = data[attr];
                    }
            }
        }
        return d;
    },
    project: {
        new: function (req, res) {
            var data = req.data;
            methods.newAndSave('Project', {
                name: data.name,
                user: methods.user.myRef()
            }, res);
        },
        // project列表
        list: function (req, res) {
            methods.findAndSend("select count(*),* from Project where user = pointer('_User','" + req.session.user.objectId + "')", res);
        }
    }
};
module.exports = methods;


/*



 查询
 var Todo = AV.Object.extend('Todo');//methods.new('Todo');
 console.log(Todo);
 var query = new AV.Query(Todo);
 query.equalTo('user', methods.user.myRef());
 query.find({
 success: function (results) {
 res.send({code: 0, data: results});
 // comments 包含所有不带图片微博的评论.
 },
 error: function (err) {
 res.send(err);
 }
 });

 注册
 var user = Data.new('User', {username: 'laomu1988', password: 'muZHIlong', email: 'laomu1988@qq.com'});
 user.signUp(null, {
 success: function (data) {
 console.log(data);
 console.log('保存用户成功！');
 },
 error: function (data, err) {
 console.log('保存用户失败！', data, err);
 }
 });
 *
 *
 *
 * */