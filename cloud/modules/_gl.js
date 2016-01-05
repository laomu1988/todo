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
    }
    ,
    find: function (sql, success, error) {
        AV.Query.doCloudQuery(sql, {success: success, error: error});
    }
    ,
    findAndSend: function (sql, res) {
        console.log('sql: ', sql);
        gl.find(sql, function (result) {
            res.json({code: 0, data: result});
        }, function (err) {
            res.json(err);
        });
    }
    ,
    findById: function (className, objectId, success, error) {
        console.log('findById', className, objectId, success, error);
        var query = new AV.Query(gl.class(className));
        query.get(objectId, {
            success: success,
            error: error
        });
    }
    ,
    class: function (className) {
        if (!classes[className]) {
            return classes[className] = AV.Object.extend(className);
        }
        return classes[className];
    }
    ,
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
    }
    ,
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
    }
    ,
    /**查找对象，并根据条件函数返回结果确定是否修改值
     * className: 类
     * objectId： 对象id
     * conditionFunc： 条件函数，假如返回true，则修改查询结果
     * data： 要修改的值
     * */
    editCondition: function (className, objectId, conditionFunc, data, res) {
        console.log('editCondition');
        gl.findById(className, objectId, function (result) {
            console.log('查询到结果：', JSON.stringify(result));
            if (conditionFunc(result)) {
                for (var attr in data) {
                    result.set(attr, data[attr]);
                }
                result.save(null, gl.send(res));
            } else {
                res.json({code: 1, message: '没有权限进行该操作！'});
            }
        }, function (err) {
            console.log('查询出错！');
            res.json(err);
        });
    }
    ,
    extend: function () {
        var ret = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var val = arguments[i];
            for (var attr in val) {
                if (attr.indexOf('__') >= 0) {
                    continue;
                }
                ret[attr] = val;
            }
        }
        return ret;
    }
    ,
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
                case 'Todo':
                case 'Role':
                case 'History':
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
})
;