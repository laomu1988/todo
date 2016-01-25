global.gl = global.gl || {};
/**将AV对象包裹在此*/
var classes = {};

gl.extend = function () {
    var ret = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var val = arguments[i];
        for (var attr in val) {
            if (attr.indexOf('__') >= 0) {
                continue;
            }
            ret[attr] = val[attr];
        }
    }
    return ret;
};

gl.extend(gl, {
    send: function (res, success, error) {
        return {
            success: function (data) {
                console.log('发送数据')
                if (typeof success == 'function') {
                    success(data);
                }
                res.json({code: 0, data: data});
            }
            ,
            error: function (data, err) {
                if (typeof error == 'function') {
                    error(err, data);
                }
                res.json(err || data);
            }
        }
    },
    clearData: function (data) {
        return JSON.parse(JSON.stringify(data));
    },
    findFirst: function (data, callback, error) {
        if (typeof data == 'object' && data.class) {
            var query = new gl.AV.Query(data.class);
            var equalValue = ['username', 'email'];
            for (var i = equalValue.length - 1; i >= 0; i--) {
                var attr = data[equalValue[i]];
                if (typeof data[attr] != 'undefined') {
                    query.equalTo(attr, data[attr]);
                }
            }
            query.first({success: callback, error: error});
        } else {
            console.error('gl.find参数格式错误！', data);
        }
    },
    find: function (data, callback, error) {
        if (typeof data == 'string') {
            AV.Query.doCloudQuery(data, {success: callback, error: error});
        }
        else if (typeof data == 'object' && data.class) {
            var query = new gl.AV.Query(data.class);
            var equalValue = ['username', 'email'];
            for (var i = equalValue.length - 1; i >= 0; i--) {
                var attr = data[equalValue[i]];
                if (typeof data[attr] != 'undefined') {
                    query.equalTo(attr, data[attr]);
                }
            }
            var objectValue = ['user', 'project', 'pid'];
            for (var i = objectValue.length - 1; i >= 0; i--) {
                var attr = data[objectValue[i]];
                if (typeof data[attr] != 'undefined') {
                    var classname = '';
                    if (attr == 'pid') {
                        classname = 'Todo';
                    } else {
                        classname = attr.charAt(0).toUpperCase() + attr.substring(1);
                    }
                    query.equalTo(attr, gl.withId(classname, data[attr]))
                }
            }
            var pagesize = data.pagesize > 0 ? data.pagesize : 20;
            var page = data.page > 0 ? data.page : 1;
            if (page > 1) {
                query.skip(page * pagesize - pagesize);
            }
            query.limit(pagesize);
            query.find({success: callback, error: error});
        } else {
            console.error('gl.find参数格式错误！', data);
        }
    },
    findAndSend: function (sql, res) {
        console.log('sql: ', sql);
        gl.find(sql, function (result) {
            res.json({code: 0, data: result});
        }, function (err) {
            res.json(err);
        });
    },
    findById: function (className, objectId, success, error) {
        console.log('findById', className, objectId, success, error);
        var query = new AV.Query(gl.class(className));
        query.get(objectId, {
            success: success,
            error: error
        });
    },
    sendById: function (className, objectId, res) {
        var query = new AV.Query(gl.class(className));
        query.get(objectId, gl.send(res));
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
        var d = gl.new(className, data);
        d.save(null, gl.send(res));
    },
    withId: function (className, objectId) {
        var obj = gl.new(className);
        obj.id = objectId;
        return obj;
    },
    editWithId: function (className, objectId, data, res) {
        var post = AV.Object.createWithoutData(className, objectId);
        for (var attr in data) {
            post.set(attr, data[attr]);
        }
        post.save(null, gl.send(res));
    },
    /**查找对象，并根据条件函数返回结果确定是否修改值
     * className: 类
     * objectId： 对象id
     * conditionFunc： 条件函数，假如返回true，则修改查询结果
     * data： 要修改的值
     * */
    editCondition: function (className, objectId, conditionFunc, data, res) {
        if (!objectId) {
            return gl.error(res, 400);
        }
        gl.findById(className, objectId, function (result) {
            if (conditionFunc(result)) {
                for (var attr in data) {
                    result.set(attr, data[attr]);
                }
                result.save(null, gl.send(res));
            } else {
                res.json({code: 1, message: '没有权限进行该操作！'});
            }
        }, function (err) {
            console.log('查询出错:',err);
            res.json(err);
        });
    },
    // 修改我的数据
    editMyData: function (className, objectId, data, user, res) {
        if (!objectId) {
            return gl.error(res, 400);
        }
        gl.editCondition(className, objectId, function (result) {
            if (result) {
                var datauser = result.get('user');
                if (datauser && datauser.id == user.objectId) {
                    return true;
                }
            }
            return false;
        }, data, res);
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
                    if (!d[attr]) {
                        d[attr] = 0;
                    }
                    break;
                case 'string':
                    d[attr] = data[attr] + '';
                    break;
                case 'Project':
                case 'User':
                case 'Todo':
                case 'Role':
                case 'History':
                case 'Group':
                case 'GroupMember':
                case 'Stage':
                    d[attr] = gl.withId(typeArray[attr], data[attr]);
                    break;
                default:
                    if (keep !== false) {
                        d[attr] = data[attr];
                    }
            }
        }
        return d;
    }
});