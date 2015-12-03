/**将AV对象包裹在此*/
var classes = {};

function send(success, error) {
    return {
        success: function (data) {
            console.log('发送数据')
            if (typeof success == 'function') {
                success(data);
            }
            gl.res.json({code: 0, data: data});
        },
        error: function (data, err) {
            if (typeof error == 'function') {
                error(err, data);
            }
            gl.res.json(err);
        }
    }
}

var gl = {
    req: null,
    res: null,
    next: null
};


var methods = {
    gl: gl,
    clearData: function (data) {
        return JSON.parse(JSON.stringify(data));
    },
    find: function (sql, success, error) {
        AV.Query.doCloudQuery(sql, {success: success, error: error});
    },
    findAndSend: function (sql) {
        console.log('sql: ', sql);
        methods.find(sql, function (result) {
            gl.res.json({code: 0, data: result});
        }, function (err) {
            gl.res.json(err);
        });
    },
    findById: function (className, objectId, success, error) {
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
    newAndSave: function (className, data) {
        console.log('newAndSave', JSON.stringify(data));
        var d = methods.new(className, data);
        d.save(null, send());
    },
    withId: function (className, objectId) {
        var obj = methods.new(className);
        obj.id = objectId;
        return obj;
    },
    editWithId: function (className, objectId, data) {
        var post = AV.Object.createWithoutData(className, objectId);
        for (var attr in data) {
            post.set(attr, data[attr]);
        }
        post.save(null, send());
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
            if (methods.user.isLogin()) {
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
            d.signUp(null, send());
        },
        login: function (req, res) {
            var data = req.data;
            console.log('用户尝试登录：', data.username);
            AV.User.logIn(data.username, data.password, send(function (data) {
                data = JSON.parse(JSON.stringify(data));
                console.log('用户登录成功：', data.username);
                req.session.user = data;
            }))
        }
        ,
        isLogin: function () {
            var user = gl.req.session.user;
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
        new: function (req, res) {
            var data = req.data;
            var d = {
                name: data.name,
                user: methods.user.myRef()
            };
            if (data.project) {
                d.project = methods.withId('Project', d.project);
            }
            methods.newAndSave('Todo', {
                name: data.name,
                user: methods.user.myRef()
            });
        },
        // todo列表
        list: function (req, res) {
            methods.findAndSend("select count(*),* from Todo where user = pointer('_User','" + req.session.user.objectId + "')");
        }
        ,
        // 修改信息 id:'',   name: '',project:''
        edit: function (req, res) {
            var data = req.data;
            var id = data.id;
            methods.findById('Todo', id, function (data) {
                if (data) {
                    // 确定是自己的Todo
                    if (data.user && data.user.id == req.session.user.objectId) {

                    }
                }
                res.json({code: 1, message: '不存在该内容！'});
            }, function (err) {
                res.json(err);
            });
        }
    }
    ,
    project: {
        new: function (req, res) {
            var data = req.data;
            methods.newAndSave('Project', {
                name: data.name,
                user: methods.user.myRef()
            });
        }

        ,
        // project列表
        list: function (req, res) {
            methods.findAndSend("select count(*),* from Project where user = pointer('_User','" + req.session.user.objectId + "')");
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